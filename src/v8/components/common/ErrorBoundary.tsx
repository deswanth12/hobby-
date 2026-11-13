import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Phone } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error('[Kavitha & Associates V8.0 ErrorBoundary]', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReturnHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[500px] flex items-center justify-center p-6 bg-[#F1EBDD] text-[#35271F]">
          <div className="max-w-xl w-full p-8 sm:p-10 rounded-3xl bg-[#071B14] border-2 border-[#B49A64]/40 shadow-2xl text-center space-y-6 text-[#F1EBDD]">
            {/* Architectural corner accents */}
            <div className="corner-bracket corner-bracket-tl" aria-hidden="true" />
            <div className="corner-bracket corner-bracket-tr" aria-hidden="true" />
            <div className="corner-bracket corner-bracket-bl" aria-hidden="true" />
            <div className="corner-bracket corner-bracket-br" aria-hidden="true" />

            <div className="w-16 h-16 rounded-full bg-[#183529] border border-[#B49A64]/60 flex items-center justify-center mx-auto text-[#B49A64] shadow-md">
              <AlertTriangle className="w-8 h-8 text-[#B49A64]" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-[#183529] border border-[#B49A64]/30 text-[#B49A64] text-[10px] uppercase font-semibold tracking-widest">
                TEMPORARY RENDERING NOTICE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F1EBDD]">
                Chambers Session Interrupted
              </h2>
              <p className="text-xs sm:text-sm text-[#AAB4A0] max-w-md mx-auto leading-relaxed">
                An unexpected interface issue occurred. Statutory practice records and client submissions remain safe and unaffected.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#B49A64] hover:bg-[#9E844E] text-[#071B14] font-semibold text-xs uppercase tracking-wider transition-all min-h-[44px]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                type="button"
                onClick={this.handleReturnHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#183529] hover:bg-[#294B39] text-[#F1EBDD] border border-[#B49A64]/40 text-xs font-semibold tracking-wider transition-all min-h-[44px]"
              >
                <Home className="w-3.5 h-3.5 text-[#B49A64]" />
                <span>Return to Practice Home</span>
              </button>
            </div>

            {/* Direct Helpline */}
            <div className="pt-4 border-t border-[#B49A64]/20 flex items-center justify-center gap-2 text-xs text-[#AAB4A0]">
              <Phone className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>Chambers Helpline: </span>
              <a href="tel:+919626350900" className="text-[#B49A64] hover:underline font-semibold">
                +91 96263 50900
              </a>
            </div>

            {/* Dev Stack Trace */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4 text-left p-3 rounded-lg bg-[#04100C] text-[11px] font-mono text-red-300 border border-red-500/30 overflow-x-auto max-h-48">
                <summary className="cursor-pointer text-[#B49A64] font-semibold pb-1">
                  Diagnostic Information (Development Only)
                </summary>
                <p className="font-bold text-red-400">{this.state.error.toString()}</p>
                <pre className="mt-2 text-[10px] whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
