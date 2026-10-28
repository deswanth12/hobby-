import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Phone } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-brand-warm px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-xl bg-brand-pale text-brand-primary flex items-center justify-center mx-auto border border-emerald-200 shadow-subtle">
          <span className="font-serif text-2xl font-bold text-brand-primary">404</span>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-brand-primary">
            Page Not Found
          </h1>
          <p className="text-sm text-charcoal-muted leading-relaxed">
            The page or document you requested does not exist or may have been relocated within the Kavitha & Associates directory.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-deep transition-all shadow-sm"
          >
            <Home className="w-4 h-4 text-gold" />
            <span>Return to Home</span>
          </Link>

          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border text-charcoal text-xs font-semibold hover:bg-white transition-all shadow-subtle"
          >
            <Phone className="w-4 h-4 text-brand-primary" />
            <span>Contact Office</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
