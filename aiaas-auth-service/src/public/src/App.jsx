import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AuthGuard from './components/guards/AuthGuard';

import LandingPage       from './pages/LandingPage';
import ServiceDetailPage  from './pages/ServiceDetailPage';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import DashboardPage     from './pages/DashboardPage';
import CreateOrgPage     from './pages/CreateOrgPage';
import OrgPage           from './pages/OrgPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public */}
            <Route path="/"              element={<LandingPage />} />
            <Route path="/services/:id"  element={<ServiceDetailPage />} />
            <Route path="/login"         element={<LoginPage />} />
            <Route path="/register"      element={<RegisterPage />} />

            {/* Protected */}
            <Route path="/dashboard" element={
              <AuthGuard><DashboardPage /></AuthGuard>
            } />
            <Route path="/orgs/new" element={
              <AuthGuard><CreateOrgPage /></AuthGuard>
            } />
            <Route path="/orgs" element={
              <AuthGuard><OrgPage /></AuthGuard>
            } />
            <Route path="/orgs/:slug" element={
              <AuthGuard><OrgPage /></AuthGuard>
            } />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
