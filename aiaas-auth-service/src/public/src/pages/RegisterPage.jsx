import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import './AuthPage.css';

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (form.phone && !/^\+?[0-9\s\-]{7,15}$/.test(form.phone)) e.phone = 'Invalid phone number';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await register(form.email, form.password, form.phone || undefined);
      addToast('Account created! Please sign in.', 'success');
      navigate('/login');
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="auth-page">
      <div className="auth-page__bg" aria-hidden="true" />

      <div className="auth-card auth-card--wide animate-fade-in-up">
        <div className="auth-card__brand">
          <svg width="36" height="36" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="reg-logo" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6c63ff"/>
                <stop offset="100%" stopColor="#a855f7"/>
              </linearGradient>
            </defs>
            <rect width="28" height="28" rx="7" fill="url(#reg-logo)"/>
            <path d="M8 20 L14 8 L20 20" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.5 16 H17.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="auth-card__brand-name">AIaaS</span>
        </div>

        <div className="auth-card__header">
          <h1 className="auth-card__title">Create your account</h1>
          <p className="auth-card__subtitle">Get started with AIaaS for free</p>
        </div>

        <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
          <Input
            id="reg-email"
            label="Email address"
            type="email"
            autoComplete="email"
            value={form.email}
            error={errors.email}
            required
            onChange={set('email')}
          />
          <div className="auth-card__row">
            <Input
              id="reg-password"
              label="Password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              error={errors.password}
              hint="Minimum 8 characters"
              required
              onChange={set('password')}
            />
            <Input
              id="reg-confirm-password"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              error={errors.confirmPassword}
              required
              onChange={set('confirmPassword')}
            />
          </div>
          <Input
            id="reg-phone"
            label="Phone number (optional)"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            error={errors.phone}
            hint="E.g. +8801712345678"
            onChange={set('phone')}
          />

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} id="register-submit">
            Create account
          </Button>
        </form>

        <p className="auth-card__switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-card__link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
