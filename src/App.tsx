import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FirmDataProvider } from './context/FirmDataContext';
import { useScrollReveal } from './hooks/useScrollReveal';

// V8.0 Architecture Layout & Public Pages
import { PublicLayout } from './v8/components/layout/PublicLayout';
import {
  HomePage,
  AboutPage,
  LeadershipPage,
  ServicesPage,
  AuditAssurancePage,
  GSTServicesPage,
  IncomeTaxPage,
  CompanyRegistrationPage,
  VirtualCFOPage,
  RERAConsultantPage,
  DynamicServiceDetailPage,
  IndustriesPage,
  LocationsPage,
  BlogPage,
  BlogArticlePage,
  NotFoundPage,
  ContactPage,
} from './v8/pages';

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

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <FirmDataProvider>
        <BrowserRouter>
          <ScrollToTop />
          <ScrollRevealInit />
          <Routes>
            {/* V8.0 Public Routes with Botanical Ledger Chrome */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/leadership" element={<LeadershipPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/audit-assurance" element={<AuditAssurancePage />} />
              <Route path="/services/gst-consultant-tirupati" element={<GSTServicesPage />} />
              <Route path="/services/income-tax-consultant-tirupati" element={<IncomeTaxPage />} />
              <Route path="/services/company-registration-tirupati" element={<CompanyRegistrationPage />} />
              <Route path="/services/virtual-cfo-tirupati" element={<VirtualCFOPage />} />
              <Route path="/services/rera-consultant-tirupati" element={<RERAConsultantPage />} />
              <Route path="/services/:slug" element={<DynamicServiceDetailPage />} />
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
                  path={ADMIN_ROUTES.articles}
                  element={
                    <AdminProtectedRoute>
                      <React.Suspense fallback={<AdminFallback />}>
                        <AdminContentPage initialTab="posts" />
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
