import React from 'react';
import { cn } from '@/lib/utils';
import { HiOutlineSparkles, HiOutlineDocumentText, HiOutlineArrowRight } from 'react-icons/hi2';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-16 px-8 text-center',
      className
    )}>
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 animate-float">
        {icon || <HiOutlineSparkles className="w-10 h-10 text-primary" />}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {action && (
        <button 
          onClick={action.onClick}
          className="btn-gradient inline-flex items-center gap-2"
        >
          {action.label}
          <HiOutlineArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export const UploadEmptyState: React.FC<{ onUpload: () => void }> = ({ onUpload }) => (
  <EmptyState
    icon={<HiOutlineDocumentText className="w-10 h-10 text-primary" />}
    title="Upload your first invoice"
    description="Drop your invoice files here or click to upload. Our AI will automatically extract and validate all key information in seconds."
    action={{
      label: 'Upload Invoice',
      onClick: onUpload,
    }}
  />
);

export const ReviewEmptyState: React.FC = () => (
  <EmptyState
    icon={<HiOutlineSparkles className="w-10 h-10 text-success" />}
    title="All caught up!"
    description="There are no invoices pending review. High-confidence extractions are automatically approved."
  />
);

export const HistoryEmptyState: React.FC<{ onUpload: () => void }> = ({ onUpload }) => (
  <EmptyState
    icon={<HiOutlineDocumentText className="w-10 h-10 text-primary" />}
    title="No processing history yet"
    description="Start by uploading invoices to see your complete processing history with audit trails."
    action={{
      label: 'Upload First Invoice',
      onClick: onUpload,
    }}
  />
);
