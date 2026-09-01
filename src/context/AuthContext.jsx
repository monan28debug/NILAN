import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const email = (firebaseUser.email || '').toLowerCase();
        // Admin if listed in VITE_ADMIN_EMAILS (fast bootstrap) OR has a Firestore
        // admins/{email} document (the durable, rules-enforced source of truth).
        let adminDocExists = false;
        try {
          const adminSnap = await getDoc(doc(db, 'admins', email));
          adminDocExists = adminSnap.exists();
        } catch {
          adminDocExists = false;
        }
        setIsAdmin(ADMIN_EMAILS.includes(email) || adminDocExists);
        const ref = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          // Stamp account creation time the moment a Google login first happens —
          // this is what the 10-day auto-deletion job (see /functions) measures from.
          await setDoc(
            ref,
            {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || '',
              createdAt: serverTimestamp(),
            },
            { merge: true }
          );
          const freshSnap = await getDoc(ref);
          setProfile(freshSnap.exists() ? freshSnap.data() : null);
        } else {
          setProfile(snap.data());
        }
        await setDoc(
          doc(db, 'loginHistory', `${firebaseUser.uid}_${Date.now()}`),
          {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            loggedInAt: serverTimestamp(),
          }
        );
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);

  const saveProfile = async (data) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    // createdAt is set once on first login and must never be overwritten here —
    // the auto-deletion job measures 10 days from that original value.
    const payload = { ...data, uid: user.uid, email: user.email, updatedAt: serverTimestamp() };
    await setDoc(ref, payload, { merge: true });
    setProfile((prev) => ({ ...(prev || {}), ...payload }));
  };

  const needsProfileSetup = !!user && (!profile || !profile.name || !profile.phone1 || !profile.address);

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, isAdmin, loginWithGoogle, logout, saveProfile, needsProfileSetup }}
    >
      {children}
    </AuthContext.Provider>
  );
}
