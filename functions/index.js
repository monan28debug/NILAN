// ─────────────────────────────────────────────────────────────
// NILAN FASHION — Scheduled Cloud Function
//
// Deletes user accounts automatically 10 days after they were created,
// per the app's existing user-management logic (users/{uid}.createdAt,
// stamped the moment someone first signs in with Google — see
// src/context/AuthContext.jsx).
//
// This has to run server-side: a browser can never be trusted to delete
// its own — or anyone else's — Firebase Auth account or Firestore data.
//
// Deploy with: firebase deploy --only functions
// Requires the Firebase project to be on the Blaze (pay-as-you-go) plan —
// scheduled functions run on Cloud Scheduler, which isn't available on
// the free Spark plan. In practice this job runs once a day and touches
// a handful of documents, so cost is effectively negligible.
// ─────────────────────────────────────────────────────────────
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

initializeApp();

const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

exports.cleanupExpiredUsers = onSchedule('every 24 hours', async () => {
  const db = getFirestore();
  const auth = getAuth();
  const cutoff = Timestamp.fromMillis(Date.now() - TEN_DAYS_MS);

  const expiredSnap = await db.collection('users').where('createdAt', '<=', cutoff).get();
  if (expiredSnap.empty) {
    console.log('No expired users to clean up.');
    return;
  }

  let deleted = 0;
  let skipped = 0;

  for (const userDoc of expiredSnap.docs) {
    const uid = userDoc.id;
    const email = (userDoc.data().email || '').toLowerCase();

    // Never delete admins, even if their user doc happens to be old.
    if (email) {
      const adminDoc = await db.collection('admins').doc(email).get();
      if (adminDoc.exists) {
        skipped++;
        continue;
      }
    }

    // Remove the Firebase Auth account.
    try {
      await auth.deleteUser(uid);
    } catch (err) {
      // User may already be gone from Auth — that's fine, keep cleaning up Firestore.
      console.warn(`Auth delete skipped for ${uid}: ${err.message}`);
    }

    // Remove personal/profile data only. Orders, return requests, wholesale
    // requests, and reviews are kept intentionally — they're business records
    // keyed by uid, not by the existence of this profile doc, and the brief
    // asks us not to delete order/purchase history.
    await Promise.all([
      db.collection('users').doc(uid).delete(),
      db.collection('carts').doc(uid).delete().catch(() => {}),
      db.collection('wishlists').doc(uid).delete().catch(() => {}),
    ]);

    deleted++;
  }

  console.log(`Cleanup complete — deleted ${deleted} expired user(s), skipped ${skipped} admin(s).`);
});
