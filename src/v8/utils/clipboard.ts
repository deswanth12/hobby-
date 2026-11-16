/**
 * Safe Clipboard Utility for Kavitha & Associates Botanical Ledger Tools
 * 
 * Provides robust two-tier clipboard copying:
 * 1. Primary: Modern Asynchronous Clipboard API (navigator.clipboard.writeText) for Secure Contexts
 * 2. Fallback: Synchronous document.execCommand('copy') via an invisible, non-scrollable textarea for
 *    non-secure contexts, embedded webviews, or when navigator.clipboard permissions are blocked.
 * 
 * Returns true if text was successfully copied, or false if both methods failed.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // 1. Primary: Modern Asynchronous Clipboard API
  if (typeof window !== 'undefined' && navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Modern API rejected or permissions denied; cascade to legacy fallback
    }
  }

  // 2. Fallback: Temporary off-screen textarea with document.execCommand('copy')
  if (typeof document !== 'undefined') {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      textArea.style.opacity = '0';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, text.length);
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch {
      return false;
    }
  }

  return false;
}
