import { create } from 'zustand';

export interface ExtractedField {
  key: string;
  value: string;
  confidence: number;
  explanation: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
  isEdited?: boolean;
  originalValue?: string;
}

export interface AuditEntry {
  id: string;
  action: 'uploaded' | 'extracted' | 'edited' | 'approved' | 'rejected' | 'flagged';
  timestamp: Date;
  user: string;
  details?: string;
  changes?: { field: string; from: string; to: string }[];
}

export interface Invoice {
  id: string;
  fileName: string;
  uploadedAt: Date;
  status: 'processing' | 'extracted' | 'review' | 'approved' | 'rejected' | 'archived';
  stage: 'upload' | 'extraction' | 'review' | 'approval' | 'archive';
  vendor: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  currency: string;
  lineItems: { description: string; quantity: number; unitPrice: number; total: number }[];
  extractedFields: ExtractedField[];
  overallConfidence: number;
  processingTimeMs: number;
  thumbnailUrl?: string;
  documentUrl?: string;
  auditTrail: AuditEntry[];
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  slaDeadline?: Date;
}

export interface DashboardMetrics {
  totalInvoices: number;
  processedToday: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  averageConfidence: number;
  manualTimeSavedMinutes: number;
  estimatedCostSavings: number;
  productivityImprovement: number;
  autoApprovalRate: number;
}

interface InvoiceStore {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  isExecutiveMode: boolean;
  dashboardMetrics: DashboardMetrics;
  confidenceThresholds: { autoApprove: number; review: number };
  
  // Actions
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  selectInvoice: (invoice: Invoice | null) => void;
  toggleExecutiveMode: () => void;
  setConfidenceThresholds: (thresholds: { autoApprove: number; review: number }) => void;
  approveInvoice: (id: string, user: string) => void;
  rejectInvoice: (id: string, user: string, reason: string) => void;
  editField: (invoiceId: string, fieldKey: string, newValue: string, user: string) => void;
  bulkApprove: (ids: string[], user: string) => void;
  getInvoicesByStatus: (status: Invoice['status']) => Invoice[];
  getReviewQueue: () => Invoice[];
}

// Mock data generators
const mockVendors = ['Acme Corp', 'TechSupply Inc', 'Office Essentials', 'Cloud Services Ltd', 'DataPro Systems', 'Global Logistics', 'Premium Materials Co'];
const mockUsers = ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Alex Wilson'];

const generateConfidenceExplanation = (field: string, confidence: number): string => {
  if (confidence >= 85) {
    return `High confidence: Clear text detection with strong pattern matching for ${field}.`;
  } else if (confidence >= 60) {
    const reasons = [
      'Date detected in non-standard format',
      'Partial text obstruction detected',
      'Multiple potential values found',
      'Text quality slightly degraded',
      'Unusual document layout detected',
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  } else {
    const reasons = [
      'Low quality scan affecting text recognition',
      'Handwritten annotations detected',
      'Non-standard document format',
      'Multiple languages detected',
      'Significant text overlap or smudging',
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }
};

const generateMockInvoice = (index: number): Invoice => {
  const confidence = Math.random() * 50 + 50; // 50-100
  const status: Invoice['status'] = confidence >= 85 ? 'approved' : confidence >= 60 ? 'review' : 'review';
  const stage: Invoice['stage'] = status === 'approved' ? 'archive' : 'review';
  
  const fields: ExtractedField[] = [
    { key: 'Invoice Number', value: `INV-${2024}${String(index + 1).padStart(4, '0')}`, confidence: Math.min(98, confidence + Math.random() * 10), explanation: '', boundingBox: { x: 65, y: 12, width: 20, height: 3 } },
    { key: 'Vendor Name', value: mockVendors[index % mockVendors.length], confidence: Math.min(99, confidence + Math.random() * 8), explanation: '', boundingBox: { x: 10, y: 8, width: 35, height: 4 } },
    { key: 'Invoice Date', value: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], confidence: confidence + Math.random() * 5 - 5, explanation: '', boundingBox: { x: 65, y: 16, width: 18, height: 3 } },
    { key: 'Due Date', value: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], confidence: confidence + Math.random() * 5 - 5, explanation: '', boundingBox: { x: 65, y: 20, width: 18, height: 3 } },
    { key: 'Total Amount', value: `$${(Math.random() * 50000 + 500).toFixed(2)}`, confidence: Math.min(97, confidence + Math.random() * 6), explanation: '', boundingBox: { x: 70, y: 75, width: 20, height: 5 } },
    { key: 'Tax Amount', value: `$${(Math.random() * 5000 + 50).toFixed(2)}`, confidence: confidence + Math.random() * 8 - 4, explanation: '', boundingBox: { x: 70, y: 70, width: 18, height: 3 } },
    { key: 'Subtotal', value: `$${(Math.random() * 45000 + 400).toFixed(2)}`, confidence: confidence + Math.random() * 5, explanation: '', boundingBox: { x: 70, y: 65, width: 18, height: 3 } },
    { key: 'Payment Terms', value: ['Net 30', 'Net 60', 'Due on Receipt'][Math.floor(Math.random() * 3)], confidence: confidence + Math.random() * 10 - 8, explanation: '', boundingBox: { x: 10, y: 85, width: 25, height: 3 } },
  ].map(f => ({ ...f, explanation: generateConfidenceExplanation(f.key, f.confidence) }));

  const lineItems = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
    description: ['Professional Services', 'Software License', 'Consulting Hours', 'Hardware Equipment', 'Support & Maintenance'][i % 5],
    quantity: Math.floor(Math.random() * 10) + 1,
    unitPrice: Math.random() * 1000 + 100,
    total: 0,
  })).map(item => ({ ...item, total: item.quantity * item.unitPrice }));

  const uploadedAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
  
  return {
    id: `inv-${Date.now()}-${index}`,
    fileName: `Invoice_${mockVendors[index % mockVendors.length].replace(/\s/g, '_')}_${index + 1}.pdf`,
    uploadedAt,
    status,
    stage,
    vendor: mockVendors[index % mockVendors.length],
    invoiceNumber: fields[0].value,
    invoiceDate: fields[2].value,
    dueDate: fields[3].value,
    totalAmount: parseFloat(fields[4].value.replace('$', '').replace(',', '')),
    currency: 'USD',
    lineItems,
    extractedFields: fields,
    overallConfidence: confidence,
    processingTimeMs: Math.random() * 3000 + 500,
    auditTrail: [
      { id: `audit-1-${index}`, action: 'uploaded', timestamp: uploadedAt, user: mockUsers[Math.floor(Math.random() * mockUsers.length)], details: 'Document uploaded via drag & drop' },
      { id: `audit-2-${index}`, action: 'extracted', timestamp: new Date(uploadedAt.getTime() + 2000), user: 'AI Engine v2.1', details: `Extracted ${fields.length} fields with ${confidence.toFixed(1)}% average confidence` },
    ],
    priority: confidence < 60 ? 'high' : confidence < 80 ? 'medium' : 'low',
    assignedTo: confidence < 85 ? mockUsers[Math.floor(Math.random() * mockUsers.length)] : undefined,
    slaDeadline: confidence < 85 ? new Date(Date.now() + (24 - Math.random() * 12) * 60 * 60 * 1000) : undefined,
  };
};

const mockInvoices: Invoice[] = Array.from({ length: 15 }, (_, i) => generateMockInvoice(i));

const calculateMetrics = (invoices: Invoice[]): DashboardMetrics => {
  const approved = invoices.filter(i => i.status === 'approved').length;
  const rejected = invoices.filter(i => i.status === 'rejected').length;
  const pendingReview = invoices.filter(i => i.status === 'review').length;
  const avgConfidence = invoices.reduce((sum, i) => sum + i.overallConfidence, 0) / invoices.length;
  const autoApproved = invoices.filter(i => i.overallConfidence >= 85 && i.status === 'approved').length;
  
  return {
    totalInvoices: invoices.length,
    processedToday: Math.floor(invoices.length * 0.4),
    pendingReview,
    approved,
    rejected,
    averageConfidence: avgConfidence,
    manualTimeSavedMinutes: invoices.length * 12, // 12 min saved per invoice
    estimatedCostSavings: invoices.length * 45, // $45 saved per invoice
    productivityImprovement: 340, // 340% improvement
    autoApprovalRate: invoices.length > 0 ? (autoApproved / invoices.length) * 100 : 0,
  };
};

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoices: mockInvoices,
  selectedInvoice: null,
  isExecutiveMode: false,
  dashboardMetrics: calculateMetrics(mockInvoices),
  confidenceThresholds: { autoApprove: 85, review: 60 },

  addInvoice: (invoice) => set((state) => {
    const newInvoices = [...state.invoices, invoice];
    return { invoices: newInvoices, dashboardMetrics: calculateMetrics(newInvoices) };
  }),

  updateInvoice: (id, updates) => set((state) => {
    const newInvoices = state.invoices.map(inv => 
      inv.id === id ? { ...inv, ...updates } : inv
    );
    return { 
      invoices: newInvoices, 
      dashboardMetrics: calculateMetrics(newInvoices),
      selectedInvoice: state.selectedInvoice?.id === id ? { ...state.selectedInvoice, ...updates } : state.selectedInvoice
    };
  }),

  deleteInvoice: (id) => set((state) => {
    const newInvoices = state.invoices.filter(inv => inv.id !== id);
    return { invoices: newInvoices, dashboardMetrics: calculateMetrics(newInvoices) };
  }),

  selectInvoice: (invoice) => set({ selectedInvoice: invoice }),

  toggleExecutiveMode: () => set((state) => ({ isExecutiveMode: !state.isExecutiveMode })),

  setConfidenceThresholds: (thresholds) => set({ confidenceThresholds: thresholds }),

  approveInvoice: (id, user) => set((state) => {
    const newInvoices = state.invoices.map(inv => {
      if (inv.id === id) {
        return {
          ...inv,
          status: 'approved' as const,
          stage: 'archive' as const,
          auditTrail: [...inv.auditTrail, {
            id: `audit-approve-${Date.now()}`,
            action: 'approved' as const,
            timestamp: new Date(),
            user,
            details: 'Invoice approved for payment',
          }],
        };
      }
      return inv;
    });
    return { invoices: newInvoices, dashboardMetrics: calculateMetrics(newInvoices) };
  }),

  rejectInvoice: (id, user, reason) => set((state) => {
    const newInvoices = state.invoices.map(inv => {
      if (inv.id === id) {
        return {
          ...inv,
          status: 'rejected' as const,
          auditTrail: [...inv.auditTrail, {
            id: `audit-reject-${Date.now()}`,
            action: 'rejected' as const,
            timestamp: new Date(),
            user,
            details: reason,
          }],
        };
      }
      return inv;
    });
    return { invoices: newInvoices, dashboardMetrics: calculateMetrics(newInvoices) };
  }),

  editField: (invoiceId, fieldKey, newValue, user) => set((state) => {
    const newInvoices = state.invoices.map(inv => {
      if (inv.id === invoiceId) {
        const updatedFields = inv.extractedFields.map(field => {
          if (field.key === fieldKey) {
            return {
              ...field,
              value: newValue,
              isEdited: true,
              originalValue: field.originalValue || field.value,
            };
          }
          return field;
        });
        return {
          ...inv,
          extractedFields: updatedFields,
          auditTrail: [...inv.auditTrail, {
            id: `audit-edit-${Date.now()}`,
            action: 'edited' as const,
            timestamp: new Date(),
            user,
            changes: [{
              field: fieldKey,
              from: inv.extractedFields.find(f => f.key === fieldKey)?.value || '',
              to: newValue,
            }],
          }],
        };
      }
      return inv;
    });
    return { invoices: newInvoices };
  }),

  bulkApprove: (ids, user) => set((state) => {
    const newInvoices = state.invoices.map(inv => {
      if (ids.includes(inv.id)) {
        return {
          ...inv,
          status: 'approved' as const,
          stage: 'archive' as const,
          auditTrail: [...inv.auditTrail, {
            id: `audit-bulk-approve-${Date.now()}`,
            action: 'approved' as const,
            timestamp: new Date(),
            user,
            details: 'Bulk approved',
          }],
        };
      }
      return inv;
    });
    return { invoices: newInvoices, dashboardMetrics: calculateMetrics(newInvoices) };
  }),

  getInvoicesByStatus: (status) => get().invoices.filter(inv => inv.status === status),

  getReviewQueue: () => get().invoices
    .filter(inv => inv.status === 'review')
    .sort((a, b) => {
      // Sort by priority first, then by SLA deadline
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (a.slaDeadline && b.slaDeadline) {
        return a.slaDeadline.getTime() - b.slaDeadline.getTime();
      }
      return 0;
    }),
}));
