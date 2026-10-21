import './App.css';
import type { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import { Footer } from './components/ui';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDashboardPage from './pages/PatientDashboardPage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import PatientsPage from './pages/PatientsPage';
import PatientDetailPage from './pages/PatientDetailPage';
import ExamsPage from './pages/ExamsPage';
import ExamDetailPage from './pages/ExamDetailPage';
import InvoicesPage from './pages/InvoicesPage';
import InvoiceDetailPage from './pages/InvoiceDetailPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
import GoogleAuthDonePage from './pages/GoogleAuthDonePage';
import OrderPayPage from './pages/OrderPayPage';
import ProfilePage from './pages/ProfilePage';

interface RequireAuthProps { children: ReactNode }

function RequireAuth({ children }: RequireAuthProps) {
  const auth = useAuth() as { isAuthenticated?: boolean; loading?: boolean };
  if (auth && auth.loading) {
    return null;
  }
  const authed = auth && typeof auth.isAuthenticated === 'boolean' ? auth.isAuthenticated : Boolean(localStorage.getItem('token'));
  if (!authed) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function HomeRoute() {
  const auth = useAuth() as { isAuthenticated?: boolean };
  const authed = auth && typeof auth.isAuthenticated === 'boolean' ? auth.isAuthenticated : Boolean(localStorage.getItem('token'));
  if (!authed) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-md)' }}>Welcome to Xray Billing Hub 2797</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }}>
          Manage your X-ray exams, invoices, and payments all in one place.
        </p>
        <div className="btn-group" style={{ display: 'inline-flex', gap: 'var(--space-md)' }}>
          <a href="/login" className="btn btn-primary">Sign In</a>
          <a href="/register" className="btn btn-secondary">Sign Up</a>
        </div>
      </div>
    );
  }
  return <ProfilePage />;
}

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <div className="ds-page">
          <Navbar />
          <main className="ds-page-main">
            <Routes>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<RequireAuth><PatientDashboardPage /></RequireAuth>} />
              <Route path="/staff" element={<RequireAuth><StaffDashboardPage /></RequireAuth>} />
              <Route path="/staff/patients" element={<RequireAuth><PatientsPage /></RequireAuth>} />
              <Route path="/staff/patients/:id" element={<RequireAuth><PatientDetailPage /></RequireAuth>} />
              <Route path="/staff/exams" element={<RequireAuth><ExamsPage /></RequireAuth>} />
              <Route path="/exams/:id" element={<RequireAuth><ExamDetailPage /></RequireAuth>} />
              <Route path="/invoices" element={<RequireAuth><InvoicesPage /></RequireAuth>} />
              <Route path="/invoices/:id" element={<RequireAuth><InvoiceDetailPage /></RequireAuth>} />
              <Route path="/payment/success" element={<RequireAuth><PaymentSuccessPage /></RequireAuth>} />
              <Route path="/payment/cancel" element={<RequireAuth><PaymentCancelPage /></RequireAuth>} />
              <Route path="/auth/google/done" element={<GoogleAuthDonePage />} />
              <Route path="/order-pay" element={<RequireAuth><OrderPayPage /></RequireAuth>} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer brand="Xray Billing Hub 2797" columns={[{ title: 'Explore', links: [{ label: 'Home', to: '/' }, { label: 'Profile', to: '/profile' }] }]} />
        </div>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
