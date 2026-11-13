import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { adminStorage } from '../../services/adminStorage';
import { ADMIN_ROUTES, IS_ADMIN_CONFIGURED } from '../../config/adminConfig';

export const AdminProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Safe Dev QA session initialization for headless capture
  if (import.meta.env.DEV && searchParams.get('qa_auth') === 'true' && !adminStorage.isAuthenticated()) {
    adminStorage.createDevSession();
  }

  const initialSession = adminStorage.getSession();
  const isDevBypass = Boolean(
    import.meta.env.DEV &&
    (searchParams.get('qa_auth') === 'true' || initialSession?.token?.startsWith('sess_dev_'))
  );

  const [isValidating, setIsValidating] = useState<boolean>(Boolean(initialSession && !isDevBypass));
  const [isVerified, setIsVerified] = useState<boolean>(Boolean(initialSession && isDevBypass));

  useEffect(() => {
    if (!initialSession || isDevBypass) {
      return;
    }

    let isMounted = true;

    const validateSession = async () => {
      try {
        const res = await fetch('/api/auth/session', {
          headers: {
            'Authorization': `Bearer ${initialSession.token}`
          }
        });

        if (!isMounted) return;

        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (data && data.success && data.session) {
            setIsVerified(true);
            setIsValidating(false);
            return;
          }
        }

        adminStorage.logout();
        setIsVerified(false);
        setIsValidating(false);
      } catch {
        if (!isMounted) return;
        adminStorage.logout();
        setIsVerified(false);
        setIsValidating(false);
      }
    };

    validateSession();

    return () => {
      isMounted = false;
    };
  }, [initialSession?.token, isDevBypass]);

  if (!IS_ADMIN_CONFIGURED) {
    return <Navigate to="/" replace />;
  }

  if (!initialSession) {
    return <Navigate to={ADMIN_ROUTES.login} state={{ from: location }} replace />;
  }

  if (isValidating) {
    return (
      <div className="min-h-screen bg-brand-deep flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-brand-gold">
          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
          <span className="font-editorial-meta text-xs tracking-wider uppercase text-emerald-200">
            Verifying Practice Session...
          </span>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return <Navigate to={ADMIN_ROUTES.login} state={{ from: location }} replace />;
  }

  return children;
};
