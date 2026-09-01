import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Guards routes that require sign-in (checkout, orders, profile, etc). There is
// no standalone /login page anymore — signing in happens via the LoginPopup
// triggered from wherever the user is, so an unauthenticated visit here just
// bounces back to /home, where the normal "please sign in" prompts take over.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/home" replace />;
  return children;
}
