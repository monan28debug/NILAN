# Nilan Fashion — E-commerce Website + Admin Panel

A complete, responsive fashion e-commerce site built with **React + Vite + Tailwind CSS**, wired to
your own **Firebase** (Auth + Firestore) and **Cloudinary** accounts. No new accounts are created —
you just paste your existing config in and run it.

Color theme: **Noir Gold** — black, ivory, and antique gold, for a premium boutique feel.

---

## 1. What's inside

```
nilan-fashion/
├── src/
│   ├── firebase/          Firebase + Cloudinary config (reads from .env — no secrets hardcoded)
│   ├── context/            Auth, Cart (with guest→login merge), Website ON/OFF status
│   ├── components/         Header, Sidebar, ProductCard, BannerCarousel, Admin layout, etc.
│   ├── pages/               All 18 user-facing pages
│   └── pages/admin/         All 20 admin panel pages
├── functions/                Scheduled Cloud Function — auto-deletes accounts after 10 days
├── firestore.rules          Firestore security rules — paste into Firebase Console
├── .env.example              Copy to .env and fill in your config
└── README.md                  This file
```

Admin panel lives at **`/admin/login`** inside the same site — no separate project.

---

## 2. One-time setup (do this before running)

### A. Connect your Firebase project

1. Go to your Firebase Console → Project settings → General → "Your apps" → copy the SDK config.
2. In this project, copy `.env.example` to a new file named `.env`.
3. Paste your values into the `VITE_FIREBASE_*` fields in `.env`.
4. In Firebase Console → **Authentication → Sign-in method**, make sure **Google** and
   **Email/Password** are both enabled (Google for shoppers, Email/Password for you as admin).

### B. Deploy the Firestore security rules

1. Open `firestore.rules` in this project.
2. In Firebase Console → **Firestore Database → Rules**, paste the entire contents in and click
   **Publish**.
3. These rules mean: products/categories/banners/FAQs are publicly readable but only admins can
   edit them; orders, carts, wishlists, and personal data are only visible to their owner and to
   admins.

### C. Create your admin account

1. In Firebase Console → **Authentication → Users → Add user**, create a user with your admin
   email + a password. This is how you'll log in at `/admin/login`.
2. In Firestore, create a collection called **`admins`**, and inside it a document whose **ID is
   your admin email** (e.g. `owner@nilanfashion.com`) — the document's content can be empty, just
   the ID matters. This is checked by the security rules.
3. As a shortcut for local testing, you can also add your email to `VITE_ADMIN_EMAILS` in `.env`
   (comma-separated for multiple admins) — this lets the app recognize you as admin immediately,
   even before the Firestore rules propagate.

### D. Connect Cloudinary

1. In your Cloudinary dashboard → **Settings → Upload → Upload presets → Add upload preset**.
2. Set **Signing Mode to "Unsigned"** and save it. This lets the browser upload images directly
   without ever exposing your API secret.
3. Copy your **Cloud name** (shown at the top of the Cloudinary dashboard) and the **preset name**
   you just created into `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` in `.env`.

### E. (Optional) Razorpay

Razorpay is wired into the Payment Settings screen but **disabled by default** — the site ships
with manual UPI + QR-code verification only, which needs no payment gateway account. If you later
get Razorpay keys, add `VITE_RAZORPAY_KEY_ID` to `.env` and flip "Enable Razorpay" on in
Admin → Payment Settings. (Full Razorpay checkout wiring is a follow-up step — ask if you want it
built out.)

---

## 3. Running it

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`). The public site loads at `/`, admin
at `/admin/login`.

To build for production:

```bash
npm run build
```

This creates a `dist/` folder — deploy it to **Firebase Hosting**, **Vercel**, **Netlify**, or any
static host. (Firebase Hosting is a natural fit since you already have a Firebase project —
`firebase init hosting` → point it at `dist` → `firebase deploy`.)

---

## 4. How the site flows

**Shopper flow (guest-first):**
Landing page → Shop Now → straight into Home (banners, categories, products) — no login wall.
Guests can browse, view product details, and add to cart freely. The moment they try to check
out, like a product, track a personal order, or open anything account-specific, a "Sign in with
Google to continue" popup appears — Google is the only sign-in option offered to shoppers. A
guest's cart is saved in the browser and automatically merged into their account cart the moment
they sign in — nothing is lost. After signing in, Checkout (coupon, COD or UPI) → Thank You page
→ Order History, which now shows full payment details (status, method, amount, date, and
transaction reference for UPI) inline on each order.

**First-time login flow:**
Google Sign-In → if it's their first time, a Profile Setup form asks for name, gender, phone,
address (landmark optional) → saved to `users/{uid}` in Firestore → straight into the Home page.
Next time they log in, this step is skipped and their saved details auto-fill checkout.

**Order flow:**
Every order gets a sequential ID like `NIL01`, `NIL02`, `NIL03`… generated safely even under
concurrent orders (a Firestore transaction counter), and it keeps extending past `NIL99` without
collisions. COD orders land in **Admin → COD Requests**; UPI orders land in **Admin → UPI
Requests**. Nothing is marked "confirmed" just because the checkout page finished — the order
stays `pending_confirmation` until an admin reviews and approves it, and only then does the
customer get notified and the order move into fulfillment.

**Admin flow:**
`/admin/login` (email + password) → Dashboard (live stats: users, orders, revenue by week/month/
year, pending requests) → manage Products, Categories, the 5 Banner slides, Coupons, Orders,
COD/UPI requests, Returns, Wholesale requests, Tracking updates, Reviews, FAQs, Contact details,
Payment settings (UPI ID + QR, Razorpay toggle), the landing page background/copy, and the big
**Website ON/OFF** switch at the top of the dashboard, which instantly puts the public site into a
maintenance screen for everyone except admins.

**Data model:** every collection listed in the original spec (`products`, `orders`, `carts`,
`wishlists`, `returnRequests`, `wholesaleRequests`, `trackingUpdates`, `coupons`,
`productHistory`, `settings`, etc.) is created automatically the first time something is written
to it — you don't need to pre-create collections in Firestore.

---

## 5. What's new in this update

- **Admin can manually edit payment status** — Admin → Orders → each order has a
  Payment status dropdown (Pending / Paid / Failed / Refunded / Cancelled), separate
  from order status. Changes appear in the customer's Order History immediately
  (it's a live Firestore listener, not a page reload).
- **Automatic 10-day account deletion** — handled by a scheduled Cloud Function in
  `/functions`, not by any code running in the browser (that would never be secure).
  See **section 6** below to deploy it — it does nothing until you do.
- **No more separate Payment Transactions page for users** — payment status, method,
  amount, date, and (for UPI) the transaction reference now live directly inside each
  order in Order History. Admin still has a Payment Transactions view for
  reconciliation, since that's an internal admin tool, not a user-facing page.
- **Guest-first browsing** — there's no more forced login page. Landing → Shop Now
  goes straight into the store. Browsing, product pages, and the cart all work
  without an account. The Google sign-in prompt only appears when a guest tries to
  do something account-specific (checkout, wishlist, track a personal order, etc.),
  and only Google sign-in is offered — no email/password option for shoppers
  (Email/Password sign-in still exists, but only for Admin at `/admin/login`).
- **Real stock management** — placing an order now runs a Firestore transaction that
  checks and decrements stock atomically, so two people buying the last item at the
  same moment can't both succeed, and stock can never go negative. If someone else
  bought the last unit a second earlier, checkout shows exactly which item ran out
  instead of silently overselling.
- **Low stock / out of stock alerts** — Admin → Dashboard now shows a live "⚠️ Low
  Stock" list (5 or fewer left) and a "⛔ Out of Stock" list, computed straight from
  live product data.
- **Admin panel is now mobile-responsive** — the sidebar becomes a slide-out drawer
  under `md` breakpoint, the Orders page switches to stacked cards on phones (and a
  full table on desktop), and every admin form that used to squeeze into two columns
  on a phone screen now stacks to one column below `md`.

## 6. Deploying the automatic account-deletion job

This part needs the Firebase CLI and the **Blaze (pay-as-you-go)** billing plan —
scheduled functions run on Cloud Scheduler, which isn't available on the free Spark
plan. In practice this job runs once a day and touches a handful of documents, so
actual cost is negligible (well within Firebase's free monthly quota even on Blaze).

```bash
npm install -g firebase-tools     # if you don't have it already
firebase login
firebase use --add                # pick your Firebase project
cd functions
npm install
cd ..
firebase deploy --only functions
```

That deploys `cleanupExpiredUsers`, which runs every 24 hours and deletes any user
whose account is more than 10 days old — removing their Firebase Auth account, their
`users/{uid}` profile, cart, and wishlist. **Admin accounts are always skipped**, and
**orders, returns, wholesale requests, and reviews are never touched**, since those
are business records that need to survive even after a shopper's account expires.

If you'd rather not enable billing right now, everything else in the app works fine
without this — accounts just won't auto-expire until you deploy it.

## 7. Notes & things to know

- **No secrets in the frontend.** Firebase config values (API key etc.) are meant to be public —
  Firestore rules are what actually secure your data. Cloudinary uses an unsigned upload preset
  for the same reason. Razorpay's secret key must never go in `.env` with a `VITE_` prefix (those
  are exposed to the browser) — it belongs in a server-side function if you wire up live payments.
- **Excel import/export** (Admin → Excel Import/Export) exports every major collection into one
  workbook (one sheet per data type) and can bulk-import products from a spreadsheet. Passwords
  and secrets are never included.
- **This is a working, production-shaped codebase**, not a mockup — every button is wired to real
  Firestore reads/writes. Test it end-to-end with a couple of real products and a test order
  before pointing customers at it.
- If something doesn't look right after deploying rules, double check the `admins/{email}`
  document ID exactly matches your Firebase Auth admin email (case-sensitive-safe: rules lowercase
  neither side automatically, so keep emails lowercase everywhere).

Questions or want the Razorpay live-payment flow, order-status emails, or a custom domain set up
next — just ask.
