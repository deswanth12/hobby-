import React from 'react';

export type SkeletonVariant = 'text' | 'card' | 'avatar' | 'image' | 'button' | 'article';

export interface LoadingSkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  aspectRatio?: '16/10' | '16/9' | '4/3' | '1/1' | 'auto';
  className?: string;
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text',
  width,
  height,
  aspectRatio,
  className = '',
  count = 1,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'avatar':
        return 'w-12 h-12 rounded-full shrink-0';
      case 'button':
        return 'h-11 w-32 rounded-full';
      case 'image':
        return 'w-full h-48 rounded-2xl';
      case 'card':
        return 'w-full h-72 rounded-2xl p-6 border border-[#B49A64]/20';
      case 'article':
        return 'w-full space-y-4';
      case 'text':
      default:
        return 'h-4 w-full rounded';
    }
  };

  const renderSingle = (key: number) => {
    if (variant === 'card') {
      return (
        <div
          key={key}
          className={`animate-pulse bg-[#183529]/10 rounded-2xl p-6 border border-[#B49A64]/15 space-y-4 ${className}`}
          style={{ width, height }}
        >
          <div className="w-2/5 h-3 bg-[#183529]/20 rounded" />
          <div className="w-4/5 h-6 bg-[#183529]/25 rounded" />
          <div className="space-y-2">
            <div className="w-full h-3.5 bg-[#183529]/15 rounded" />
            <div className="w-5/6 h-3.5 bg-[#183529]/15 rounded" />
          </div>
          <div className="pt-4 flex items-center justify-between border-t border-[#B49A64]/10">
            <div className="w-24 h-4 bg-[#183529]/15 rounded" />
            <div className="w-8 h-8 rounded-full bg-[#183529]/20" />
          </div>
        </div>
      );
    }

    if (variant === 'article') {
      return (
        <div key={key} className={`animate-pulse space-y-4 w-full ${className}`}>
          <div className="w-full h-64 bg-[#183529]/15 rounded-2xl" />
          <div className="w-1/3 h-4 bg-[#183529]/20 rounded" />
          <div className="w-3/4 h-8 bg-[#183529]/25 rounded" />
          <div className="space-y-2.5 pt-2">
            <div className="w-full h-4 bg-[#183529]/15 rounded" />
            <div className="w-full h-4 bg-[#183529]/15 rounded" />
            <div className="w-4/5 h-4 bg-[#183529]/15 rounded" />
          </div>
        </div>
      );
    }

    return (
      <div
        key={key}
        className={`animate-pulse bg-[#183529]/15 ${getVariantStyles()} ${className}`}
        style={{
          width,
          height,
          aspectRatio: aspectRatio ? aspectRatio.replace('/', ' / ') : undefined,
        }}
      />
    );
  };

  return (
    <div className="space-y-3" role="status" aria-label="Loading content...">
      {Array.from({ length: count }, (_, i) => renderSingle(i))}
      <span className="sr-only">Loading content...</span>
    </div>
  );
};

export default LoadingSkeleton;
