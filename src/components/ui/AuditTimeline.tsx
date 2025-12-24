import React from 'react';
import { cn } from '@/lib/utils';
import { AuditEntry } from '@/store/invoiceStore';
import { 
  HiOutlineCloudArrowUp,
  HiOutlineCpuChip,
  HiOutlinePencilSquare,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineFlag,
} from 'react-icons/hi2';

interface AuditTimelineProps {
  entries: AuditEntry[];
  className?: string;
}

const actionConfig = {
  uploaded: { icon: HiOutlineCloudArrowUp, color: 'text-info bg-info/10' },
  extracted: { icon: HiOutlineCpuChip, color: 'text-primary bg-primary/10' },
  edited: { icon: HiOutlinePencilSquare, color: 'text-warning bg-warning/10' },
  approved: { icon: HiOutlineCheckCircle, color: 'text-success bg-success/10' },
  rejected: { icon: HiOutlineXCircle, color: 'text-destructive bg-destructive/10' },
  flagged: { icon: HiOutlineFlag, color: 'text-warning bg-warning/10' },
};

export const AuditTimeline: React.FC<AuditTimelineProps> = ({ entries, className }) => {
  const formatTimestamp = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={cn('space-y-0', className)}>
      {entries.map((entry, index) => {
        const config = actionConfig[entry.action];
        const Icon = config.icon;

        return (
          <div key={entry.id} className="timeline-item">
            <div className={cn('timeline-dot', config.color)}>
              <Icon className="w-3 h-3" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground capitalize">
                  {entry.action.replace('_', ' ')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(entry.timestamp)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{entry.user}</p>
              {entry.details && (
                <p className="text-sm text-muted-foreground/80">{entry.details}</p>
              )}
              {entry.changes && entry.changes.length > 0 && (
                <div className="mt-2 space-y-1">
                  {entry.changes.map((change, i) => (
                    <div key={i} className="text-xs bg-muted/50 rounded px-2 py-1">
                      <span className="font-medium">{change.field}:</span>{' '}
                      <span className="text-destructive line-through">{change.from}</span>{' '}
                      <span className="text-success">→ {change.to}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
