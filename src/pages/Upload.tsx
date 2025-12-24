import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useInvoiceStore } from '@/store/invoiceStore';
import { mockApi } from '@/services/mockApi';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';
import { WorkflowStages } from '@/components/ui/WorkflowStages';
import { HiOutlineCloudArrowUp, HiOutlineDocumentText, HiOutlineSparkles, HiOutlineCheckCircle } from 'react-icons/hi2';
import { cn } from '@/lib/utils';

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const { addInvoice, confidenceThresholds } = useInvoiceStore();
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const onDrop = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setCurrentFile(file);
    setUploading(true);
    
    try {
      toast.info('Uploading document...');
      const { invoiceId } = await mockApi.uploadDocument(file);
      setUploading(false);
      setProcessing(true);
      
      toast.info('AI is extracting invoice data...');
      const data = await mockApi.extractInvoiceData(invoiceId, file.name);
      setExtractedData({ ...data, invoiceId, fileName: file.name });
      setProcessing(false);
      toast.success('Extraction complete!');
    } catch (error) {
      toast.error('Failed to process document');
      setUploading(false);
      setProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 1,
  });

  const handleApprove = () => {
    if (!extractedData) return;
    const autoApprove = extractedData.overallConfidence >= confidenceThresholds.autoApprove;
    const status = autoApprove ? 'approved' : 'review';
    
    addInvoice({
      id: extractedData.invoiceId,
      fileName: extractedData.fileName,
      uploadedAt: new Date(),
      status,
      stage: autoApprove ? 'archive' : 'review',
      vendor: extractedData.fields.find((f: any) => f.key === 'Vendor Name')?.value || 'Unknown',
      invoiceNumber: extractedData.fields.find((f: any) => f.key === 'Invoice Number')?.value || '',
      invoiceDate: extractedData.fields.find((f: any) => f.key === 'Invoice Date')?.value || '',
      dueDate: extractedData.fields.find((f: any) => f.key === 'Due Date')?.value || '',
      totalAmount: parseFloat(extractedData.fields.find((f: any) => f.key === 'Total Amount')?.value?.replace(/[$,]/g, '') || '0'),
      currency: 'USD',
      lineItems: extractedData.lineItems,
      extractedFields: extractedData.fields,
      overallConfidence: extractedData.overallConfidence,
      processingTimeMs: 2500,
      auditTrail: [
        { id: '1', action: 'uploaded', timestamp: new Date(), user: 'Current User', details: 'Document uploaded' },
        { id: '2', action: 'extracted', timestamp: new Date(), user: 'AI Engine v2.1', details: `Extracted with ${extractedData.overallConfidence.toFixed(1)}% confidence` },
      ],
      priority: extractedData.overallConfidence < 60 ? 'high' : extractedData.overallConfidence < 80 ? 'medium' : 'low',
    });

    toast.success(autoApprove ? 'Invoice auto-approved!' : 'Invoice sent to review queue');
    navigate(autoApprove ? '/history' : '/review-queue');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold">Upload Invoice</h1>
        <p className="text-muted-foreground">Drop your invoice and watch AI extract all fields instantly</p>
      </div>

      {!extractedData ? (
        <div
          {...getRootProps()}
          className={cn(
            'upload-zone flex flex-col items-center justify-center min-h-[300px]',
            isDragActive && 'upload-zone-active'
          )}
        >
          <input {...getInputProps()} />
          {uploading || processing ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <HiOutlineSparkles className="w-8 h-8 text-primary" />
              </div>
              <p className="text-lg font-medium">{uploading ? 'Uploading...' : 'AI is extracting data...'}</p>
              <p className="text-sm text-muted-foreground mt-2">This usually takes 2-3 seconds</p>
            </div>
          ) : (
            <>
              <HiOutlineCloudArrowUp className="w-16 h-16 text-primary mb-4" />
              <p className="text-lg font-medium">Drop invoice here or click to upload</p>
              <p className="text-sm text-muted-foreground mt-2">Supports PDF, PNG, JPG</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <HiOutlineDocumentText className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium">{extractedData.fileName}</p>
                  <p className="text-sm text-muted-foreground">Processed successfully</p>
                </div>
              </div>
              <ConfidenceBadge confidence={extractedData.overallConfidence} size="lg" />
            </div>
            <WorkflowStages currentStage="extraction" />
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Extracted Fields</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {extractedData.fields.map((field: any) => (
                <div key={field.key} className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{field.key}</span>
                    <ConfidenceBadge confidence={field.confidence} explanation={field.explanation} size="sm" showLabel={false} />
                  </div>
                  <p className="font-medium">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={handleApprove} className="btn-gradient flex-1 flex items-center justify-center gap-2">
              <HiOutlineCheckCircle className="w-5 h-5" />
              {extractedData.overallConfidence >= confidenceThresholds.autoApprove ? 'Approve & Archive' : 'Send to Review'}
            </button>
            <button onClick={() => setExtractedData(null)} className="px-6 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors">
              Upload Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
