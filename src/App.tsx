import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { ScrollProgress } from './components/ScrollProgress';
import { BackToTop } from './components/BackToTop';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FirmDataProvider } from './context/FirmDataContext';
import { useScrollReveal } from './hooks/useScrollReveal';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { AuditAssurancePage } from './pages/AuditAssurancePage';
import { IndustriesPage } from './pages/IndustriesPage';
import { LocationsPage } from './pages/LocationsPage';
import { ContactPage } from './pages/ContactPage';
import { BlogPage } from './pages/BlogPage';
import { BlogArticlePage } from './pages/BlogArticlePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages (Code-split for optimized initial page load)
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';
import { ADMIN_ROUTES, IS_ADMIN_CONFIGURED } from './config/adminConfig';

const AdminLoginPage = React.lazy(() => import('./pages/admin/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminOverviewPage = React.lazy(() => import('./pages/admin/AdminOverviewPage').then(m => ({ default: m.AdminOverviewPage })));
const AdminEnquiriesPage = React.lazy(() => import('./pages/admin/AdminEnquiriesPage').then(m => ({ default: m.AdminEnquiriesPage })));
const AdminContentPage = React.lazy(() => import('./pages/admin/AdminContentPage').then(m => ({ default: m.AdminContentPage })));
const AdminSettingsPage = React.lazy(() => import('./pages/admin/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));

const AdminFallback: React.FC = () => (
  <div className="min-h-screen bg-brand-deep flex items-center justify-center p-4">
    <div className="flex flex-col items-center gap-3 text-brand-gold">
      <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
      <span className="font-editorial-meta text-xs tracking-wider uppercase text-emerald-200">
        Loading Practice Console...
      </span>
    </div>
  </div>
);

const ScrollRevealInit: React.FC = () => {
  useScrollReveal();
  return null;
};

/**
 * Public Layout Wrapper:
 * Includes public top navigation bar, scroll progress tracker, footer,
 * floating WhatsApp consultation button, and back-to-top button.
 */
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-warm selection:bg-brand-pale selection:text-brand-primary relative overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-5 focus:py-2.5 focus:bg-brand-chambers focus:text-brand-tintedwhite focus:border focus:border-brand-gold focus:rounded-full focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-gold text-xs font-semibold tracking-wide transition-all"
      >
        Skip to main content
      </a>
      <ScrollProgress />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-grow outline-none overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <FirmDataProvider>
        <BrowserRouter>
          <ScrollToTop />
          <ScrollRevealInit />
          <Routes>
            {/* Public Routes with public chrome */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/audit-assurance" element={<AuditAssurancePage />} />
              <Route path="/industries" element={<IndustriesPage />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogArticlePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Quarantined Legacy Admin Routes - Strictly Return Generic 404 */}
            <Route path="/admin" element={<NotFoundPage />} />
            <Route path="/admin/*" element={<NotFoundPage />} />

            {/* Secret Admin Authentication & Dedicated Management Console (Code-Split) */}
            {IS_ADMIN_CONFIGURED && (
              <>
                <Route
                  path={ADMIN_ROUTES.login}
                  element={
                    <React.Suspense fallback={<AdminFallback />}>
                      <AdminLoginPage />
                    </React.Suspense>
                  }
                />
                <Route
                  path={ADMIN_ROUTES.root}
                  element={
                    <AdminProtectedRoute>
                      <React.Suspense fallback={<AdminFallback />}>
                        <AdminOverviewPage />
                      </React.Suspense>
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path={ADMIN_ROUTES.enquiries}
                  element={
                    <AdminProtectedRoute>
                      <React.Suspense fallback={<AdminFallback />}>
                        <AdminEnquiriesPage />
                      </React.Suspense>
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path={ADMIN_ROUTES.content}
                  element={
                    <AdminProtectedRoute>
                      <React.Suspense fallback={<AdminFallback />}>
                        <AdminContentPage />
                      </React.Suspense>
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path={ADMIN_ROUTES.settings}
                  element={
                    <AdminProtectedRoute>
                      <React.Suspense fallback={<AdminFallback />}>
                        <AdminSettingsPage />
                      </React.Suspense>
                    </AdminProtectedRoute>
                  }
                />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </FirmDataProvider>
    </ErrorBoundary>
  );
};

export default App;
