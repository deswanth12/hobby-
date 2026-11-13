import React from 'react';

export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-[#071B14] focus:text-[#F1EBDD] focus:border focus:border-[#B49A64] focus:rounded-full focus:shadow-2xl focus:font-semibold focus:text-xs focus:uppercase focus:tracking-wider focus:outline-none"
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;
