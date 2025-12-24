import React from 'react';
import { cn } from '@/lib/utils';
import { ExtractedField } from '@/store/invoiceStore';
import { useUIStore } from '@/store/uiStore';

interface DocumentPreviewProps {
  fields: ExtractedField[];
  className?: string;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ fields, className }) => {
  const { highlightedField, setHighlightedField } = useUIStore();

  // Simulated invoice document layout
  return (
    <div 
      className={cn(
        'relative bg-card border border-border rounded-xl overflow-hidden',
        'aspect-[8.5/11] p-6 font-mono text-xs',
        className
      )}
    >
      {/* Document header */}
      <div className="flex justify-between mb-8">
        <div className="space-y-1">
          <div className="h-8 w-32 bg-primary/20 rounded flex items-center justify-center text-primary font-bold text-sm">
            INVOICE
          </div>
          <div 
            className={cn(
              'mt-4 px-2 py-1 rounded cursor-pointer transition-all',
              highlightedField === 'Vendor Name' && 'doc-highlight'
            )}
            onClick={() => setHighlightedField('Vendor Name')}
          >
            <p className="text-foreground font-semibold">{fields.find(f => f.key === 'Vendor Name')?.value || 'Vendor Name'}</p>
            <p className="text-muted-foreground text-[10px]">123 Business Street</p>
            <p className="text-muted-foreground text-[10px]">City, State 12345</p>
          </div>
        </div>
        <div className="text-right space-y-2">
          <div 
            className={cn(
              'px-2 py-1 rounded cursor-pointer transition-all',
              highlightedField === 'Invoice Number' && 'doc-highlight'
            )}
            onClick={() => setHighlightedField('Invoice Number')}
          >
            <p className="text-muted-foreground">Invoice #</p>
            <p className="text-foreground font-medium">{fields.find(f => f.key === 'Invoice Number')?.value || 'INV-0001'}</p>
          </div>
          <div 
            className={cn(
              'px-2 py-1 rounded cursor-pointer transition-all',
              highlightedField === 'Invoice Date' && 'doc-highlight'
            )}
            onClick={() => setHighlightedField('Invoice Date')}
          >
            <p className="text-muted-foreground">Date</p>
            <p className="text-foreground">{fields.find(f => f.key === 'Invoice Date')?.value || '2024-01-01'}</p>
          </div>
          <div 
            className={cn(
              'px-2 py-1 rounded cursor-pointer transition-all',
              highlightedField === 'Due Date' && 'doc-highlight'
            )}
            onClick={() => setHighlightedField('Due Date')}
          >
            <p className="text-muted-foreground">Due Date</p>
            <p className="text-foreground">{fields.find(f => f.key === 'Due Date')?.value || '2024-02-01'}</p>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div 
        className={cn(
          'mb-6 px-2 py-1 rounded cursor-pointer transition-all',
          highlightedField === 'Billing Address' && 'doc-highlight'
        )}
        onClick={() => setHighlightedField('Billing Address')}
      >
        <p className="text-muted-foreground mb-1">Bill To:</p>
        <p className="text-foreground">{fields.find(f => f.key === 'Billing Address')?.value?.split(',')[0] || 'Customer Name'}</p>
        <p className="text-muted-foreground text-[10px]">{fields.find(f => f.key === 'Billing Address')?.value || 'Address'}</p>
      </div>

      {/* Line items table */}
      <div className="mb-6 border border-border rounded overflow-hidden">
        <div className="bg-muted/50 px-3 py-2 flex text-[10px] font-medium text-muted-foreground">
          <span className="flex-1">Description</span>
          <span className="w-16 text-right">Qty</span>
          <span className="w-20 text-right">Rate</span>
          <span className="w-20 text-right">Amount</span>
        </div>
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="px-3 py-2 flex text-[10px] border-t border-border">
            <span className="flex-1 text-foreground">Professional Services</span>
            <span className="w-16 text-right text-muted-foreground">1</span>
            <span className="w-20 text-right text-muted-foreground">$1,500.00</span>
            <span className="w-20 text-right text-foreground">$1,500.00</span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-48 space-y-1">
          <div 
            className={cn(
              'flex justify-between px-2 py-1 rounded cursor-pointer transition-all',
              highlightedField === 'Subtotal' && 'doc-highlight'
            )}
            onClick={() => setHighlightedField('Subtotal')}
          >
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">{fields.find(f => f.key === 'Subtotal')?.value || '$4,500.00'}</span>
          </div>
          <div 
            className={cn(
              'flex justify-between px-2 py-1 rounded cursor-pointer transition-all',
              highlightedField === 'Tax Amount' && 'doc-highlight'
            )}
            onClick={() => setHighlightedField('Tax Amount')}
          >
            <span className="text-muted-foreground">Tax</span>
            <span className="text-foreground">{fields.find(f => f.key === 'Tax Amount')?.value || '$450.00'}</span>
          </div>
          <div 
            className={cn(
              'flex justify-between px-2 py-1 rounded cursor-pointer transition-all font-bold bg-primary/10 border border-primary/20',
              highlightedField === 'Total Amount' && 'doc-highlight'
            )}
            onClick={() => setHighlightedField('Total Amount')}
          >
            <span className="text-primary">Total</span>
            <span className="text-primary">{fields.find(f => f.key === 'Total Amount')?.value || '$4,950.00'}</span>
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      <div 
        className={cn(
          'absolute bottom-6 left-6 px-2 py-1 rounded cursor-pointer transition-all',
          highlightedField === 'Payment Terms' && 'doc-highlight'
        )}
        onClick={() => setHighlightedField('Payment Terms')}
      >
        <p className="text-muted-foreground">Payment Terms: <span className="text-foreground">{fields.find(f => f.key === 'Payment Terms')?.value || 'Net 30'}</span></p>
      </div>

      {/* Click instruction */}
      <div className="absolute bottom-2 right-2 text-[9px] text-muted-foreground/50">
        Click fields to highlight
      </div>
    </div>
  );
};
