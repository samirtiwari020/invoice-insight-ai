import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoiceStore } from '@/store/invoiceStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AuditTimeline } from '@/components/ui/AuditTimeline';
import { HistoryEmptyState } from '@/components/ui/EmptyState';
import { HiOutlineEye } from 'react-icons/hi2';

const History: React.FC = () => {
  const navigate = useNavigate();
  const { invoices } = useInvoiceStore();
  const processedInvoices = invoices.filter(i => i.status === 'approved' || i.status === 'rejected');

  if (processedInvoices.length === 0) {
    return <HistoryEmptyState onUpload={() => navigate('/upload')} />;
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold">Processing History</h1>
        <p className="text-muted-foreground">{processedInvoices.length} processed invoices</p>
      </div>

      <div className="space-y-4">
        {processedInvoices.map((invoice) => (
          <div key={invoice.id} className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold">{invoice.vendor}</h3>
                  <StatusBadge status={invoice.status} />
                </div>
                <p className="text-sm text-muted-foreground">{invoice.invoiceNumber} • ${invoice.totalAmount.toLocaleString()}</p>
              </div>
              <button onClick={() => navigate(`/processing/${invoice.id}`)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <HiOutlineEye className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <AuditTimeline entries={invoice.auditTrail.slice(-3)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
