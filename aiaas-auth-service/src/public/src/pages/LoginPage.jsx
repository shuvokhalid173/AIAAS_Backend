import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import './AuthPage.css';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await login(form.email, form.password);
      addToast('Welcome back! 🎉', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed. Check your credentials.', 'error');
      setErrors({ password: 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__bg" aria-hidden="true" />

      <div className="auth-card animate-fade-in-up">
        {/* Brand */}
        <div className="auth-card__brand">
          <svg width="36" height="36" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="auth-logo" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6c63ff"/>
                <stop offset="100%" stopColor="#a855f7"/>
              </linearGradient>
            </defs>
            <rect width="28" height="28" rx="7" fill="url(#auth-logo)"/>
            <path d="M8 20 L14 8 L20 20" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.5 16 H17.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="auth-card__brand-name">AIaaS</span>
        </div>

        <div className="auth-card__header">
          <h1 className="auth-card__title">Welcome back</h1>
          <p className="auth-card__subtitle">Sign in to your account to continue</p>
        </div>

        <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
          <Input
            id="login-email"
            label="Email address"
            type="email"
            autoComplete="email"
            value={form.email}
            error={errors.email}
            required
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Input
            id="login-password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            error={errors.password}
            required
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} id="login-submit">
            Sign in
          </Button>
        </form>

        <p className="auth-card__switch">
          Don't have an account?{' '}
          <Link to="/register" className="auth-card__link">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
