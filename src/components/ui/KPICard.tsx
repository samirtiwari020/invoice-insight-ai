import React from 'react';
import { cn } from '@/lib/utils';
import { HiOutlineArrowUp, HiOutlineArrowDown, HiOutlineMinus } from 'react-icons/hi2';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'info' | 'primary';
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  className,
}) => {
  const variantStyles = {
    default: 'border-border',
    success: 'border-success/30 bg-success/5',
    warning: 'border-warning/30 bg-warning/5',
    info: 'border-info/30 bg-info/5',
    primary: 'border-primary/30 bg-primary/5',
  };

  const iconBgStyles = {
    default: 'bg-muted',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    info: 'bg-info/20 text-info',
    primary: 'bg-primary/20 text-primary',
  };

  return (
    <div className={cn('kpi-card hover:shadow-lg transition-all duration-300', variantStyles[variant], className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              {trend.value > 0 ? (
                <HiOutlineArrowUp className="w-4 h-4 text-success" />
              ) : trend.value < 0 ? (
                <HiOutlineArrowDown className="w-4 h-4 text-destructive" />
              ) : (
                <HiOutlineMinus className="w-4 h-4 text-muted-foreground" />
              )}
              <span className={cn(
                'text-sm font-medium',
                trend.value > 0 ? 'text-success' : trend.value < 0 ? 'text-destructive' : 'text-muted-foreground'
              )}>
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', iconBgStyles[variant])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
