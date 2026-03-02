import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    addToast('You have been logged out.', 'info');
    navigate('/');
  };

  const initials = user?.email ? user.email[0].toUpperCase() : '?';

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        {/* Brand */}
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#6c63ff"/>
                  <stop offset="100%" stopColor="#a855f7"/>
                </linearGradient>
              </defs>
              <rect width="28" height="28" rx="7" fill="url(#logo-grad)"/>
              <path d="M8 20 L14 8 L20 20" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.5 16 H17.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="navbar__wordmark">
            AI<span className="navbar__wordmark-accent">aaS</span>
          </span>
        </Link>

        {/* Links */}
        <div className="navbar__links">
          <NavLink to="/" end className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}>
            Services
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard" className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}>
              Dashboard
            </NavLink>
          )}
        </div>

        {/* Auth area */}
        <div className="navbar__auth">
          {isAuthenticated ? (
            <div className="navbar__user">
              <div className="navbar__avatar" title={user?.email}>
                {initials}
              </div>
              <div className="navbar__user-info">
                <p className="navbar__user-email">{user?.email}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Sign out
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Sign in
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                Get started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
