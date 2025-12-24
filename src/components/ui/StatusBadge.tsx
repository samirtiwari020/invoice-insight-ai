import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'processing' | 'extracted' | 'review' | 'approved' | 'rejected' | 'archived';
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  processing: { label: 'Processing', className: 'badge-info' },
  extracted: { label: 'Extracted', className: 'badge-primary' },
  review: { label: 'Needs Review', className: 'badge-warning' },
  approved: { label: 'Approved', className: 'badge-success' },
  rejected: { label: 'Rejected', className: 'badge-danger' },
  archived: { label: 'Archived', className: 'bg-muted text-muted-foreground' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = statusConfig[status];
  
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span className={cn(config.className, sizeStyles[size], 'rounded-full font-medium')}>
      {config.label}
    </span>
  );
};

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const config = {
    low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
    medium: { label: 'Medium', className: 'bg-warning/10 text-warning' },
    high: { label: 'High', className: 'bg-destructive/10 text-destructive' },
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium',
      config[priority].className
    )}>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full',
        priority === 'low' && 'bg-muted-foreground',
        priority === 'medium' && 'bg-warning',
        priority === 'high' && 'bg-destructive animate-pulse'
      )} />
      {config[priority].label}
    </span>
  );
};
