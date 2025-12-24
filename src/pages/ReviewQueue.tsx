import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoiceStore } from '@/store/invoiceStore';
import { toast } from 'sonner';
import { StatusBadge, PriorityBadge } from '@/components/ui/StatusBadge';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';
import { ReviewEmptyState } from '@/components/ui/EmptyState';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineClock } from 'react-icons/hi2';

const ReviewQueue: React.FC = () => {
  const navigate = useNavigate();
  const { getReviewQueue, approveInvoice, rejectInvoice } = useInvoiceStore();
  const queue = getReviewQueue();

  const handleApprove = (id: string) => {
    approveInvoice(id, 'Current User');
    toast.success('Invoice approved');
  };

  const handleReject = (id: string) => {
    rejectInvoice(id, 'Current User', 'Rejected during review');
    toast.info('Invoice rejected');
  };

  const getTimeRemaining = (deadline?: Date) => {
    if (!deadline) return null;
    const hours = Math.max(0, Math.floor((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60)));
    return `${hours}h remaining`;
  };

  if (queue.length === 0) return <ReviewEmptyState />;

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold">Review Queue</h1>
        <p className="text-muted-foreground">{queue.length} invoices awaiting human verification</p>
      </div>

      <div className="space-y-4">
        {queue.map((invoice) => (
          <div key={invoice.id} className="glass-card p-6 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{invoice.vendor}</h3>
                  <PriorityBadge priority={invoice.priority} />
                  <StatusBadge status={invoice.status} size="sm" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Invoice #:</span> {invoice.invoiceNumber}</div>
                  <div><span className="text-muted-foreground">Amount:</span> ${invoice.totalAmount.toLocaleString()}</div>
                  <div><span className="text-muted-foreground">Date:</span> {invoice.invoiceDate}</div>
                  <div><span className="text-muted-foreground">Due:</span> {invoice.dueDate}</div>
                </div>
                {invoice.slaDeadline && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-warning">
                    <HiOutlineClock className="w-4 h-4" />
                    {getTimeRemaining(invoice.slaDeadline)}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-3">
                <ConfidenceBadge confidence={invoice.overallConfidence} />
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(invoice.id)} className="p-2 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors">
                    <HiOutlineCheckCircle className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleReject(invoice.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                    <HiOutlineXCircle className="w-5 h-5" />
                  </button>
                  <button onClick={() => navigate(`/processing/${invoice.id}`)} className="px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium">
                    Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewQueue;
