import React from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Minimalist luxury breadcrumb navigation component with schema-compatible microdata markup.
 * Follows V6.4 design tokens: forest green links, champagne gold dividers, and bronze gold active state.
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`py-2.5 ${className}`}>
      <ol
        className="flex items-center flex-wrap gap-2 text-xs font-editorial-meta"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={item.path}
              className="inline-flex items-center gap-2"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {isLast ? (
                <span
                  className="text-[#7E5E1E] font-semibold tracking-wide"
                  aria-current="page"
                  itemProp="name"
                >
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    to={item.path}
                    className="text-[#153F32] hover:text-[#0F3E2E] transition-colors tracking-wide"
                    itemProp="item"
                  >
                    <span itemProp="name">{item.name}</span>
                  </Link>
                  <span className="text-[#C5A059] select-none text-[12px] font-normal" aria-hidden="true">
                    /
                  </span>
                </>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
