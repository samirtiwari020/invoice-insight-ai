import React from 'react';
import { cn } from '@/lib/utils';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi2';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ConfidenceBadgeProps {
  confidence: number;
  explanation?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  explanation,
  size = 'md',
  showLabel = true,
}) => {
  const getConfidenceLevel = (value: number) => {
    if (value >= 85) return { level: 'high', label: 'High', color: 'text-success bg-success/10 border-success/30' };
    if (value >= 60) return { level: 'medium', label: 'Review', color: 'text-warning bg-warning/10 border-warning/30' };
    return { level: 'low', label: 'Low', color: 'text-destructive bg-destructive/10 border-destructive/30' };
  };

  const { level, label, color } = getConfidenceLevel(confidence);

  const sizeStyles = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const Badge = (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium border',
      color,
      sizeStyles[size]
    )}>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full',
        level === 'high' && 'bg-success',
        level === 'medium' && 'bg-warning',
        level === 'low' && 'bg-destructive'
      )} />
      <span>{confidence.toFixed(0)}%</span>
      {showLabel && <span className="text-muted-foreground">({label})</span>}
      {explanation && (
        <HiOutlineQuestionMarkCircle className="w-3.5 h-3.5 text-muted-foreground" />
      )}
    </span>
  );

  if (explanation) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {Badge}
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium text-sm">Why this confidence?</p>
              <p className="text-xs text-muted-foreground">{explanation}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return Badge;
};

interface ConfidenceBarProps {
  confidence: number;
  showPercentage?: boolean;
  className?: string;
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  confidence,
  showPercentage = true,
  className,
}) => {
  const getColor = (value: number) => {
    if (value >= 85) return 'bg-success';
    if (value >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div 
          className={cn('h-full rounded-full transition-all duration-500', getColor(confidence))}
          style={{ width: `${Math.min(100, confidence)}%` }}
        />
      </div>
      {showPercentage && (
        <span className="text-sm font-medium text-muted-foreground w-12 text-right">
          {confidence.toFixed(0)}%
        </span>
      )}
    </div>
  );
};
