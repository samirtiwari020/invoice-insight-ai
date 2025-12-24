import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'button';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className,
  variant = 'text',
  count = 1,
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded',
    card: 'h-32 w-full rounded-xl',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24 rounded-lg',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn('skeleton', variantStyles[variant], className)}
        />
      ))}
    </>
  );
};

interface KPISkeletonProps {
  count?: number;
}

export const KPISkeleton: React.FC<KPISkeletonProps> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="kpi-card">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-8 w-32 rounded" />
              <div className="skeleton h-3 w-20 rounded" />
            </div>
            <div className="skeleton h-12 w-12 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="bg-muted/50 px-4 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="skeleton h-4 flex-1 rounded" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="px-4 py-3 border-t border-border flex gap-4">
          {Array.from({ length: cols }).map((_, col) => (
            <div key={col} className="skeleton h-4 flex-1 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
};

interface ChartSkeletonProps {
  type?: 'bar' | 'line' | 'pie';
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({ type = 'bar' }) => {
  if (type === 'pie') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="skeleton h-48 w-48 rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-end gap-2 h-48">
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i} 
            className="skeleton flex-1 rounded-t"
            style={{ height: `${Math.random() * 60 + 40}%` }}
          />
        ))}
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton h-3 flex-1 rounded" />
        ))}
      </div>
    </div>
  );
};
