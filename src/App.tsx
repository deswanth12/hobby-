import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FirmDataProvider } from './context/FirmDataContext';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { AuditAssurancePage } from './pages/AuditAssurancePage';
import { IndustriesPage } from './pages/IndustriesPage';
import { LocationsPage } from './pages/LocationsPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages & Protected Route
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

/**
 * Public Layout Wrapper:
 * Includes public top navigation bar, footer, and floating WhatsApp consultation button.
 */
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-warm selection:bg-brand-pale selection:text-brand-primary">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <FirmDataProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes with public chrome */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/audit-assurance" element={<AuditAssurancePage />} />
              <Route path="/industries" element={<IndustriesPage />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Authentication & Dedicated Management Console */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminOverviewPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/enquiries"
              element={
                <AdminProtectedRoute>
                  <AdminEnquiriesPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/content"
              element={
                <AdminProtectedRoute>
                  <AdminContentPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminProtectedRoute>
                  <AdminSettingsPage />
                </AdminProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </FirmDataProvider>
    </ErrorBoundary>
  );
};

export default App;
