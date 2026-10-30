import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { adminStorage } from '../../services/adminStorage';
import { ADMIN_ROUTES, IS_ADMIN_CONFIGURED } from '../../config/adminConfig';

export const AdminProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  if (!IS_ADMIN_CONFIGURED) {
    return <Navigate to="/" replace />;
  }

  // Safe Dev QA session initialization for headless capture
  if (import.meta.env.DEV && searchParams.get('qa_auth') === 'true' && !adminStorage.isAuthenticated()) {
    adminStorage.createDevSession();
  }

  const authenticated = adminStorage.isAuthenticated();

  if (!authenticated) {
    return <Navigate to={ADMIN_ROUTES.login} state={{ from: location }} replace />;
  }

  return children;
};
