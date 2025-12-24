import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useUIStore } from '@/store/uiStore';
import { toast } from 'sonner';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';
import { WorkflowStages } from '@/components/ui/WorkflowStages';
import { DocumentPreview } from '@/components/ui/DocumentPreview';
import { AuditTimeline } from '@/components/ui/AuditTimeline';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineArrowDownTray } from 'react-icons/hi2';
import { cn } from '@/lib/utils';

const Processing: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, approveInvoice, rejectInvoice, editField } = useInvoiceStore();
  const { highlightedField } = useUIStore();
  
  const invoice = invoices.find(inv => inv.id === id);
  
  if (!invoice) {
    return <div className="text-center py-20"><p>Invoice not found</p></div>;
  }

  const handleApprove = () => {
    approveInvoice(invoice.id, 'Current User');
    toast.success('Invoice approved!');
    navigate('/history');
  };

  const handleReject = () => {
    rejectInvoice(invoice.id, 'Current User', 'Rejected during review');
    toast.info('Invoice rejected');
    navigate('/review-queue');
  };

  const handleExport = (format: 'json' | 'csv') => {
    const data = format === 'json' 
      ? JSON.stringify(invoice.extractedFields, null, 2)
      : invoice.extractedFields.map(f => `${f.key},${f.value}`).join('\n');
    
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${invoice.invoiceNumber}.${format}`;
    a.click();
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{invoice.vendor}</h1>
          <p className="text-muted-foreground">{invoice.invoiceNumber}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => handleExport('json')} className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors flex items-center gap-2">
            <HiOutlineArrowDownTray className="w-4 h-4" /> JSON
          </button>
          <button onClick={() => handleExport('csv')} className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors flex items-center gap-2">
            <HiOutlineArrowDownTray className="w-4 h-4" /> CSV
          </button>
        </div>
      </div>

      <div className="glass-card p-4">
        <WorkflowStages currentStage={invoice.stage} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Preview */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Document Preview</h3>
          <DocumentPreview fields={invoice.extractedFields} />
        </div>

        {/* Extracted Fields */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Extracted Data</h3>
            <ConfidenceBadge confidence={invoice.overallConfidence} />
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {invoice.extractedFields.map((field) => (
              <div 
                key={field.key} 
                className={cn(
                  'p-3 rounded-lg border transition-all cursor-pointer',
                  highlightedField === field.key ? 'border-primary bg-primary/5' : 'border-border bg-muted/20',
                  field.isEdited && 'ring-2 ring-warning/30'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">{field.key}</span>
                  <ConfidenceBadge confidence={field.confidence} explanation={field.explanation} size="sm" showLabel={false} />
                </div>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => editField(invoice.id, field.key, e.target.value, 'Current User')}
                  className="w-full bg-transparent font-medium focus:outline-none focus:ring-1 focus:ring-primary rounded px-1"
                />
                {field.isEdited && (
                  <p className="text-xs text-warning mt-1">Edited from: {field.originalValue}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Trail */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Audit Trail</h3>
        <AuditTimeline entries={invoice.auditTrail} />
      </div>

      {/* Actions */}
      {invoice.status === 'review' && (
        <div className="flex gap-4">
          <button onClick={handleApprove} className="btn-gradient flex-1 flex items-center justify-center gap-2">
            <HiOutlineCheckCircle className="w-5 h-5" /> Approve Invoice
          </button>
          <button onClick={handleReject} className="px-6 py-2.5 rounded-lg border border-destructive text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2">
            <HiOutlineXCircle className="w-5 h-5" /> Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default Processing;
