import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home, Phone } from 'lucide-react';
import { FIRM_DATA } from '../data/firmData';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled Application Exception:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-brand-warm flex items-center justify-center px-4 py-16">
          <div className="max-w-xl w-full bg-white rounded-2xl border border-border shadow-card p-6 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-xl bg-red-50 text-red-700 flex items-center justify-center mx-auto border border-red-200 shadow-subtle">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block">
                Application Notice
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary">
                An Unexpected Exception Occurred
              </h1>
              <p className="text-sm text-charcoal-muted leading-relaxed max-w-md mx-auto">
                An unexpected technical error interrupted page display. No data has been lost or transmitted. Please reload the interface or return to the main chambers directory.
              </p>
            </div>

            {/* Error Message for debugging in development only */}
            {import.meta.env.DEV && this.state.error && (
              <div className="text-left bg-brand-surface rounded-lg p-3 text-xs text-charcoal-muted border border-border font-mono overflow-x-auto max-h-32">
                <span className="text-red-700 font-semibold block mb-1">Diagnostic Info (Development Only):</span>
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-deep transition-all shadow-sm btn-tactile"
              >
                <RotateCcw className="w-4 h-4 text-gold" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border text-charcoal text-xs font-semibold hover:bg-brand-pale transition-all shadow-subtle btn-tactile"
              >
                <Home className="w-4 h-4 text-brand-primary" />
                <span>Return to Homepage</span>
              </button>
            </div>

            {/* Helpline */}
            <div className="pt-4 border-t border-border text-xs text-charcoal-muted flex items-center justify-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gold-dark" />
              <span>
                Urgent filing or audit deadline? Call{' '}
                <a
                  href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                  className="font-semibold text-brand-primary hover:underline"
                >
                  {FIRM_DATA.contact.primaryPhone}
                </a>
              </span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
