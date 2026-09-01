import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useSite } from './context/SiteContext';
import LoginPopup from './components/LoginPopup';
import MaintenanceScreen from './components/MaintenanceScreen';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Landing from './pages/Landing';
import ProfileSetup from './pages/ProfileSetup';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ThankYou from './pages/ThankYou';
import OrderHistory from './pages/OrderHistory';
import TrackOrder from './pages/TrackOrder';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import ReturnRequest from './pages/ReturnRequest';
import WholesaleRequest from './pages/WholesaleRequest';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Notifications from './pages/Notifications';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBanners from './pages/admin/AdminBanners';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCODRequests from './pages/admin/AdminCODRequests';
import AdminUPIRequests from './pages/admin/AdminUPIRequests';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminReturnRequests from './pages/admin/AdminReturnRequests';
import AdminWholesaleRequests from './pages/admin/AdminWholesaleRequests';
import AdminTracking from './pages/admin/AdminTracking';
import AdminReviews from './pages/admin/AdminReviews';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminUsers from './pages/admin/AdminUsers';
import AdminFAQ from './pages/admin/AdminFAQ';
import AdminContact from './pages/admin/AdminContact';
import AdminPaymentSettings from './pages/admin/AdminPaymentSettings';
import AdminWebsiteToggle from './pages/admin/AdminWebsiteToggle';
import AdminImportExport from './pages/admin/AdminImportExport';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  const { isAdmin } = useAuth();
  const { isWebsiteEnabled, maintenanceMessage, loaded } = useSite();
  const [loginOpen, setLoginOpen] = useState(false);
  const requireLogin = () => setLoginOpen(true);

  const path = window.location.pathname;
  const isAdminPath = path.startsWith('/admin');

  if (loaded && !isWebsiteEnabled && !isAdminPath && !isAdmin) {
    return <MaintenanceScreen message={maintenanceMessage} />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
        <Route path="/home" element={<Home onRequireLogin={requireLogin} />} />
        <Route path="/product/:id" element={<ProductDetails onRequireLogin={requireLogin} />} />
        <Route path="/cart" element={<Cart onRequireLogin={requireLogin} />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout onRequireLogin={requireLogin} /></ProtectedRoute>} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistory onRequireLogin={requireLogin} /></ProtectedRoute>} />
        <Route path="/track-order" element={<TrackOrder onRequireLogin={requireLogin} />} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist onRequireLogin={requireLogin} /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile onRequireLogin={requireLogin} /></ProtectedRoute>} />
        <Route path="/returns" element={<ProtectedRoute><ReturnRequest onRequireLogin={requireLogin} /></ProtectedRoute>} />
        <Route path="/wholesale" element={<ProtectedRoute><WholesaleRequest onRequireLogin={requireLogin} /></ProtectedRoute>} />
        <Route path="/faq" element={<FAQ onRequireLogin={requireLogin} />} />
        <Route path="/contact" element={<Contact onRequireLogin={requireLogin} />} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications onRequireLogin={requireLogin} /></ProtectedRoute>} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
        <Route path="/admin/banners" element={<AdminRoute><AdminBanners /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/cod-requests" element={<AdminRoute><AdminCODRequests /></AdminRoute>} />
        <Route path="/admin/upi-requests" element={<AdminRoute><AdminUPIRequests /></AdminRoute>} />
        <Route path="/admin/transactions" element={<AdminRoute><AdminTransactions /></AdminRoute>} />
        <Route path="/admin/returns" element={<AdminRoute><AdminReturnRequests /></AdminRoute>} />
        <Route path="/admin/wholesale" element={<AdminRoute><AdminWholesaleRequests /></AdminRoute>} />
        <Route path="/admin/tracking" element={<AdminRoute><AdminTracking /></AdminRoute>} />
        <Route path="/admin/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />
        <Route path="/admin/coupons" element={<AdminRoute><AdminCoupons /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/faq" element={<AdminRoute><AdminFAQ /></AdminRoute>} />
        <Route path="/admin/contact" element={<AdminRoute><AdminContact /></AdminRoute>} />
        <Route path="/admin/payment-settings" element={<AdminRoute><AdminPaymentSettings /></AdminRoute>} />
        <Route path="/admin/website-toggle" element={<AdminRoute><AdminWebsiteToggle /></AdminRoute>} />
        <Route path="/admin/import-export" element={<AdminRoute><AdminImportExport /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
      </Routes>
      <LoginPopup open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
