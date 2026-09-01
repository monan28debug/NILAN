import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (isAdmin) navigate('/admin', { replace: true });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm">
        <p className="kicker text-gold mb-3">Nilan Fashion</p>
        <h1 className="font-display text-3xl text-ivory mb-8">Admin Login</h1>
        <input
          type="email"
          required
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent border border-ivory/25 px-4 py-3 text-ivory placeholder:text-ivory/40 focus:border-gold outline-none mb-4"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent border border-ivory/25 px-4 py-3 text-ivory placeholder:text-ivory/40 focus:border-gold outline-none mb-4"
        />
        {error && <p className="text-rust text-xs mb-4">{error}</p>}
        <button disabled={loading} className="btn-gold w-full">{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}
