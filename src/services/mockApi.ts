import axios from 'axios';
import { Invoice, ExtractedField, AuditEntry } from '@/store/invoiceStore';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock extracted fields generator
const generateExtractedFields = (filename: string): ExtractedField[] => {
  const baseConfidence = Math.random() * 30 + 65; // 65-95
  
  return [
    {
      key: 'Invoice Number',
      value: `INV-${Date.now().toString().slice(-6)}`,
      confidence: Math.min(98, baseConfidence + Math.random() * 10),
      explanation: baseConfidence > 80 ? 'Clear alphanumeric pattern detected with high accuracy.' : 'Invoice number format slightly unusual, manual verification recommended.',
      boundingBox: { x: 65, y: 12, width: 20, height: 3 },
    },
    {
      key: 'Vendor Name',
      value: filename.split('_')[0] || 'Unknown Vendor',
      confidence: Math.min(99, baseConfidence + Math.random() * 8),
      explanation: 'Vendor name extracted from header section.',
      boundingBox: { x: 10, y: 8, width: 35, height: 4 },
    },
    {
      key: 'Invoice Date',
      value: new Date().toISOString().split('T')[0],
      confidence: baseConfidence + Math.random() * 5 - 5,
      explanation: baseConfidence > 75 ? 'Date format recognized and validated.' : 'Date detected in words instead of numeric format.',
      boundingBox: { x: 65, y: 16, width: 18, height: 3 },
    },
    {
      key: 'Due Date',
      value: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      confidence: baseConfidence + Math.random() * 5 - 5,
      explanation: 'Payment due date calculated from terms.',
      boundingBox: { x: 65, y: 20, width: 18, height: 3 },
    },
    {
      key: 'Total Amount',
      value: `$${(Math.random() * 25000 + 1000).toFixed(2)}`,
      confidence: Math.min(97, baseConfidence + Math.random() * 6),
      explanation: 'Total amount extracted from summary section.',
      boundingBox: { x: 70, y: 75, width: 20, height: 5 },
    },
    {
      key: 'Tax Amount',
      value: `$${(Math.random() * 2500 + 100).toFixed(2)}`,
      confidence: baseConfidence + Math.random() * 8 - 4,
      explanation: baseConfidence > 70 ? 'Tax amount clearly identified.' : 'Multiple tax values detected, using highest confidence match.',
      boundingBox: { x: 70, y: 70, width: 18, height: 3 },
    },
    {
      key: 'Subtotal',
      value: `$${(Math.random() * 22000 + 800).toFixed(2)}`,
      confidence: baseConfidence + Math.random() * 5,
      explanation: 'Subtotal calculated from line items.',
      boundingBox: { x: 70, y: 65, width: 18, height: 3 },
    },
    {
      key: 'Payment Terms',
      value: ['Net 30', 'Net 60', 'Due on Receipt'][Math.floor(Math.random() * 3)],
      confidence: baseConfidence + Math.random() * 10 - 8,
      explanation: 'Payment terms extracted from footer.',
      boundingBox: { x: 10, y: 85, width: 25, height: 3 },
    },
    {
      key: 'PO Number',
      value: `PO-${Math.floor(Math.random() * 900000 + 100000)}`,
      confidence: baseConfidence + Math.random() * 5 - 10,
      explanation: baseConfidence > 72 ? 'PO reference found and validated.' : 'Purchase order number partially obscured.',
      boundingBox: { x: 10, y: 25, width: 20, height: 3 },
    },
    {
      key: 'Billing Address',
      value: '123 Business Park, Suite 400, San Francisco, CA 94105',
      confidence: baseConfidence + Math.random() * 5 - 5,
      explanation: 'Address extracted using location pattern matching.',
      boundingBox: { x: 10, y: 35, width: 40, height: 8 },
    },
  ];
};

export const mockApi = {
  // Simulate document upload and processing
  async uploadDocument(file: File): Promise<{ invoiceId: string; processingTime: number }> {
    await delay(1500);
    return {
      invoiceId: `inv-${Date.now()}`,
      processingTime: Math.random() * 2000 + 500,
    };
  },

  // Simulate AI extraction
  async extractInvoiceData(invoiceId: string, filename: string): Promise<{
    fields: ExtractedField[];
    overallConfidence: number;
    lineItems: { description: string; quantity: number; unitPrice: number; total: number }[];
  }> {
    await delay(2000);
    
    const fields = generateExtractedFields(filename);
    const overallConfidence = fields.reduce((sum, f) => sum + f.confidence, 0) / fields.length;
    
    const lineItems = Array.from({ length: Math.floor(Math.random() * 4) + 2 }, (_, i) => {
      const quantity = Math.floor(Math.random() * 10) + 1;
      const unitPrice = Math.random() * 500 + 50;
      return {
        description: ['Professional Services', 'Software License', 'Consulting Hours', 'Hardware Equipment', 'Support & Maintenance', 'Training Session'][i % 6],
        quantity,
        unitPrice,
        total: quantity * unitPrice,
      };
    });
    
    return { fields, overallConfidence, lineItems };
  },

  // Simulate validation
  async validateInvoice(invoiceId: string): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    await delay(500);
    
    const hasErrors = Math.random() > 0.8;
    const hasWarnings = Math.random() > 0.5;
    
    return {
      isValid: !hasErrors,
      errors: hasErrors ? ['Duplicate invoice number detected', 'Vendor not in approved list'] : [],
      warnings: hasWarnings ? ['Total amount exceeds typical range for this vendor', 'Due date is earlier than usual'] : [],
    };
  },

  // Get analytics data
  async getAnalytics(dateRange: { start: Date; end: Date }): Promise<{
    dailyProcessed: { date: string; count: number; automated: number; manual: number }[];
    vendorBreakdown: { vendor: string; count: number; totalAmount: number }[];
    confidenceDistribution: { range: string; count: number }[];
    savingsOverTime: { date: string; timeSaved: number; costSaved: number }[];
  }> {
    await delay(800);
    
    const days = 30;
    const dailyProcessed = Array.from({ length: days }, (_, i) => {
      const date = new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000);
      const total = Math.floor(Math.random() * 50) + 20;
      const automated = Math.floor(total * (Math.random() * 0.3 + 0.5));
      return {
        date: date.toISOString().split('T')[0],
        count: total,
        automated,
        manual: total - automated,
      };
    });

    const vendorBreakdown = [
      { vendor: 'Acme Corp', count: 45, totalAmount: 125000 },
      { vendor: 'TechSupply Inc', count: 38, totalAmount: 98000 },
      { vendor: 'Office Essentials', count: 32, totalAmount: 45000 },
      { vendor: 'Cloud Services Ltd', count: 28, totalAmount: 180000 },
      { vendor: 'DataPro Systems', count: 22, totalAmount: 67000 },
    ];

    const confidenceDistribution = [
      { range: '90-100%', count: 45 },
      { range: '80-90%', count: 32 },
      { range: '70-80%', count: 18 },
      { range: '60-70%', count: 12 },
      { range: '<60%', count: 8 },
    ];

    const savingsOverTime = Array.from({ length: days }, (_, i) => {
      const date = new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000);
      return {
        date: date.toISOString().split('T')[0],
        timeSaved: Math.floor(Math.random() * 200) + 100,
        costSaved: Math.floor(Math.random() * 1500) + 500,
      };
    });

    return { dailyProcessed, vendorBreakdown, confidenceDistribution, savingsOverTime };
  },

  // Export data
  async exportInvoices(invoiceIds: string[], format: 'json' | 'csv'): Promise<string> {
    await delay(1000);
    return format === 'json' 
      ? JSON.stringify({ exported: invoiceIds.length, format, timestamp: new Date().toISOString() })
      : `invoice_id,vendor,amount,date\n${invoiceIds.map(id => `${id},Vendor,1000,2024-01-01`).join('\n')}`;
  },
};

// Create axios instance with interceptors for demo
export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  // Add auth token, etc.
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
