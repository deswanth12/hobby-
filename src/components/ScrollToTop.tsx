import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      let attempts = 0;
      const tryScroll = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (attempts < 5) {
          attempts++;
          requestAnimationFrame(tryScroll);
        } else {
          window.scrollTo(0, 0);
        }
      };
      requestAnimationFrame(tryScroll);
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};
