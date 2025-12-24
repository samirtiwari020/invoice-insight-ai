import React from 'react';
import { cn } from '@/lib/utils';
import { 
  HiOutlineCloudArrowUp,
  HiOutlineCpuChip,
  HiOutlineUserCircle,
  HiOutlineCheckCircle,
  HiOutlineArchiveBox,
} from 'react-icons/hi2';

type Stage = 'upload' | 'extraction' | 'review' | 'approval' | 'archive';

interface WorkflowStagesProps {
  currentStage: Stage;
  className?: string;
  compact?: boolean;
}

const stages: { key: Stage; label: string; icon: React.ElementType }[] = [
  { key: 'upload', label: 'Upload', icon: HiOutlineCloudArrowUp },
  { key: 'extraction', label: 'AI Extraction', icon: HiOutlineCpuChip },
  { key: 'review', label: 'Human Review', icon: HiOutlineUserCircle },
  { key: 'approval', label: 'Approved', icon: HiOutlineCheckCircle },
  { key: 'archive', label: 'Archived', icon: HiOutlineArchiveBox },
];

export const WorkflowStages: React.FC<WorkflowStagesProps> = ({
  currentStage,
  className,
  compact = false,
}) => {
  const currentIndex = stages.findIndex(s => s.key === currentStage);

  return (
    <div className={cn('flex items-center', compact ? 'gap-2' : 'gap-1', className)}>
      {stages.map((stage, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;

        const Icon = stage.icon;

        if (compact) {
          return (
            <React.Fragment key={stage.key}>
              <div 
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-all',
                  isComplete && 'bg-success text-success-foreground',
                  isCurrent && 'bg-primary text-primary-foreground ring-2 ring-primary/30',
                  isPending && 'bg-muted text-muted-foreground'
                )}
                title={stage.label}
              >
                <Icon className="w-4 h-4" />
              </div>
              {index < stages.length - 1 && (
                <div 
                  className={cn(
                    'w-8 h-0.5 transition-colors',
                    index < currentIndex ? 'bg-success' : 'bg-muted'
                  )}
                />
              )}
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={stage.key}>
            <div 
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
                isComplete && 'workflow-stage-complete',
                isCurrent && 'workflow-stage-active',
                isPending && 'workflow-stage-pending'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{stage.label}</span>
            </div>
            {index < stages.length - 1 && (
              <div 
                className={cn(
                  'w-8 h-0.5 transition-colors',
                  index < currentIndex ? 'bg-success' : 'bg-muted'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

interface WorkflowFunnelProps {
  counts: {
    upload: number;
    extraction: number;
    review: number;
    approved: number;
    archived: number;
  };
  className?: string;
}

export const WorkflowFunnel: React.FC<WorkflowFunnelProps> = ({
  counts,
  className,
}) => {
  const maxCount = Math.max(...Object.values(counts), 1);

  const funnelStages = [
    { key: 'upload', label: 'Uploaded', count: counts.upload, color: 'bg-info' },
    { key: 'extraction', label: 'Extracted', count: counts.extraction, color: 'bg-primary' },
    { key: 'review', label: 'In Review', count: counts.review, color: 'bg-warning' },
    { key: 'approved', label: 'Approved', count: counts.approved, color: 'bg-success' },
    { key: 'archived', label: 'Archived', count: counts.archived, color: 'bg-muted-foreground' },
  ];

  return (
    <div className={cn('space-y-3', className)}>
      {funnelStages.map((stage) => (
        <div key={stage.key} className="flex items-center gap-4">
          <span className="w-20 text-sm text-muted-foreground text-right">{stage.label}</span>
          <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
            <div 
              className={cn('h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-3', stage.color)}
              style={{ width: `${(stage.count / maxCount) * 100}%` }}
            >
              <span className="text-sm font-bold text-card">{stage.count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
