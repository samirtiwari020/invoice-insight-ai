import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useInvoiceStore } from '@/store/invoiceStore';
import { mockApi } from '@/services/mockApi';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';
import { WorkflowStages } from '@/components/ui/WorkflowStages';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineCloudArrowUp, 
  HiOutlineDocumentText, 
  HiOutlineSparkles, 
  HiOutlineCheckCircle,
  HiOutlineEnvelope,
  HiOutlineDocumentDuplicate,
  HiOutlineDocument,
  HiOutlinePlus,
  HiOutlineXMark,
} from 'react-icons/hi2';
import { cn } from '@/lib/utils';

type UploadMode = 'single' | 'batch' | 'email';

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const { addInvoice, confidenceThresholds } = useInvoiceStore();
  const [uploadMode, setUploadMode] = useState<UploadMode>('single');
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [batchProgress, setBatchProgress] = useState(0);
  const [emailConfig, setEmailConfig] = useState({
    email: '',
    connected: false,
    fetching: false,
  });

  // Single file upload
  const onDropSingle = useCallback(async (files: File[]) => {
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
      setExtractedData({ ...data, invoiceId: invoiceId, fileName: file.name });
      setProcessing(false);
      toast.success('Extraction complete!');
    } catch (error) {
      toast.error('Failed to process document');
      setUploading(false);
      setProcessing(false);
    }
  }, []);

  // Batch file upload
  const onDropBatch = useCallback((files: File[]) => {
    setBatchFiles(prev => [...prev, ...files]);
  }, []);

  const removeBatchFile = (index: number) => {
    setBatchFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processBatchFiles = async () => {
    if (batchFiles.length === 0) return;
    setUploading(true);
    setBatchProgress(0);

    for (let i = 0; i < batchFiles.length; i++) {
      const file = batchFiles[i];
      try {
        const { invoiceId } = await mockApi.uploadDocument(file);
        const data = await mockApi.extractInvoiceData(invoiceId, file.name);
        
        const autoApprove = data.overallConfidence >= confidenceThresholds.autoApprove;
        addInvoice({
          id: invoiceId,
          fileName: file.name,
          uploadedAt: new Date(),
          status: autoApprove ? 'approved' : 'review',
          stage: autoApprove ? 'archive' : 'review',
          vendor: data.fields.find((f: any) => f.key === 'Vendor Name')?.value || 'Unknown',
          invoiceNumber: data.fields.find((f: any) => f.key === 'Invoice Number')?.value || '',
          invoiceDate: data.fields.find((f: any) => f.key === 'Invoice Date')?.value || '',
          dueDate: data.fields.find((f: any) => f.key === 'Due Date')?.value || '',
          totalAmount: parseFloat(data.fields.find((f: any) => f.key === 'Total Amount')?.value?.replace(/[$,]/g, '') || '0'),
          currency: 'USD',
          lineItems: data.lineItems,
          extractedFields: data.fields,
          overallConfidence: data.overallConfidence,
          processingTimeMs: 2500,
          auditTrail: [
            { id: '1', action: 'uploaded', timestamp: new Date(), user: 'Current User', details: 'Batch uploaded' },
            { id: '2', action: 'extracted', timestamp: new Date(), user: 'AI Engine v2.1', details: `Extracted with ${data.overallConfidence.toFixed(1)}% confidence` },
          ],
          priority: data.overallConfidence < 60 ? 'high' : data.overallConfidence < 80 ? 'medium' : 'low',
        });

        setBatchProgress(((i + 1) / batchFiles.length) * 100);
      } catch (error) {
        toast.error(`Failed to process ${file.name}`);
      }
    }

    setUploading(false);
    toast.success(`Processed ${batchFiles.length} invoices!`);
    setBatchFiles([]);
    navigate('/review-queue');
  };

  // Email connection simulation
  const connectEmail = () => {
    setEmailConfig(prev => ({ ...prev, fetching: true }));
    setTimeout(() => {
      setEmailConfig({ email: 'invoices@company.com', connected: true, fetching: false });
      toast.success('Email connected successfully!');
    }, 1500);
  };

  const fetchFromEmail = async () => {
    setEmailConfig(prev => ({ ...prev, fetching: true }));
    toast.info('Scanning inbox for invoice attachments...');
    
    setTimeout(async () => {
      // Simulate finding 3 invoices in email
      for (let i = 0; i < 3; i++) {
        const mockFile = new File([''], `email-invoice-${i + 1}.pdf`, { type: 'application/pdf' });
        const { invoiceId } = await mockApi.uploadDocument(mockFile);
        const data = await mockApi.extractInvoiceData(invoiceId, mockFile.name);
        
        const autoApprove = data.overallConfidence >= confidenceThresholds.autoApprove;
        addInvoice({
          id: invoiceId,
          fileName: mockFile.name,
          uploadedAt: new Date(),
          status: autoApprove ? 'approved' : 'review',
          stage: autoApprove ? 'archive' : 'review',
          vendor: data.fields.find((f: any) => f.key === 'Vendor Name')?.value || 'Unknown',
          invoiceNumber: data.fields.find((f: any) => f.key === 'Invoice Number')?.value || '',
          invoiceDate: data.fields.find((f: any) => f.key === 'Invoice Date')?.value || '',
          dueDate: data.fields.find((f: any) => f.key === 'Due Date')?.value || '',
          totalAmount: parseFloat(data.fields.find((f: any) => f.key === 'Total Amount')?.value?.replace(/[$,]/g, '') || '0'),
          currency: 'USD',
          lineItems: data.lineItems,
          extractedFields: data.fields,
          overallConfidence: data.overallConfidence,
          processingTimeMs: 2500,
          auditTrail: [
            { id: '1', action: 'uploaded', timestamp: new Date(), user: 'Email Import', details: 'Fetched from email' },
            { id: '2', action: 'extracted', timestamp: new Date(), user: 'AI Engine v2.1', details: `Extracted with ${data.overallConfidence.toFixed(1)}% confidence` },
          ],
          priority: data.overallConfidence < 60 ? 'high' : data.overallConfidence < 80 ? 'medium' : 'low',
        });
      }
      
      setEmailConfig(prev => ({ ...prev, fetching: false }));
      toast.success('Found and processed 3 invoices from email!');
      navigate('/review-queue');
    }, 2500);
  };

  const { getRootProps: getSingleRootProps, getInputProps: getSingleInputProps, isDragActive: isSingleDragActive } = useDropzone({
    onDrop: onDropSingle,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 1,
    disabled: uploadMode !== 'single',
  });

  const { getRootProps: getBatchRootProps, getInputProps: getBatchInputProps, isDragActive: isBatchDragActive } = useDropzone({
    onDrop: onDropBatch,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg'] },
    disabled: uploadMode !== 'batch',
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

  const uploadModes = [
    { id: 'single' as UploadMode, label: 'Single Upload', icon: HiOutlineDocument, description: 'Upload one invoice at a time' },
    { id: 'batch' as UploadMode, label: 'Batch Upload', icon: HiOutlineDocumentDuplicate, description: 'Upload multiple invoices together' },
    { id: 'email' as UploadMode, label: 'Email Import', icon: HiOutlineEnvelope, description: 'Import from connected email' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-2xl font-bold">Upload Invoice</h1>
        <p className="text-muted-foreground">Drop your invoice and watch AI extract all fields instantly</p>
      </motion.div>

      {/* Upload Mode Selector */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {uploadModes.map((mode, index) => (
          <motion.button
            key={mode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setUploadMode(mode.id);
              setExtractedData(null);
            }}
            className={cn(
              'p-6 rounded-xl border-2 transition-all duration-300 text-left',
              uploadMode === mode.id
                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                : 'border-border bg-card hover:border-primary/50'
            )}
          >
            <mode.icon className={cn(
              'w-8 h-8 mb-3 transition-colors',
              uploadMode === mode.id ? 'text-primary' : 'text-muted-foreground'
            )} />
            <h3 className="font-semibold mb-1">{mode.label}</h3>
            <p className="text-sm text-muted-foreground">{mode.description}</p>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Single Upload Mode */}
        {uploadMode === 'single' && !extractedData && (
          <motion.div
            key="single"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div
              {...getSingleRootProps()}
              className={cn(
                'upload-zone flex flex-col items-center justify-center min-h-[300px]',
              isSingleDragActive && 'upload-zone-active'
            )}
          >
            <input {...getSingleInputProps()} />
            {uploading || processing ? (
              <div className="text-center">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <HiOutlineSparkles className="w-8 h-8 text-primary" />
                </motion.div>
                <p className="text-lg font-medium">{uploading ? 'Uploading...' : 'AI is extracting data...'}</p>
                <p className="text-sm text-muted-foreground mt-2">This usually takes 2-3 seconds</p>
              </div>
            ) : (
              <>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <HiOutlineCloudArrowUp className="w-16 h-16 text-primary mb-4" />
                </motion.div>
              <p className="text-lg font-medium">Drop invoice here or click to upload</p>
              <p className="text-sm text-muted-foreground mt-2">Supports PDF, PNG, JPG</p>
            </>
          )}
            </div>
          </motion.div>
        )}

        {/* Batch Upload Mode */}
        {uploadMode === 'batch' && (
          <motion.div
            key="batch"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div
              {...getBatchRootProps()}
              className={cn(
                'upload-zone flex flex-col items-center justify-center min-h-[200px]',
                isBatchDragActive && 'upload-zone-active'
              )}
            >
              <input {...getBatchInputProps()} />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <HiOutlinePlus className="w-12 h-12 text-primary mb-3" />
              </motion.div>
              <p className="text-lg font-medium">Drop multiple invoices or click to select</p>
              <p className="text-sm text-muted-foreground mt-2">Upload up to 50 files at once</p>
            </div>

            {batchFiles.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="glass-card p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{batchFiles.length} files ready</h3>
                  <button
                    onClick={() => setBatchFiles([])}
                    className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                  {batchFiles.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <HiOutlineDocumentText className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                      <button
                        onClick={() => removeBatchFile(index)}
                        className="p-1 hover:bg-destructive/10 rounded transition-colors"
                      >
                        <HiOutlineXMark className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {uploading && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Processing...</span>
                      <span>{Math.round(batchProgress)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${batchProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {!uploading && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={processBatchFiles}
                    className="btn-gradient w-full mt-4 flex items-center justify-center gap-2"
                  >
                    <HiOutlineSparkles className="w-5 h-5" />
                    Process All Invoices
                  </motion.button>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Email Import Mode */}
        {uploadMode === 'email' && (
          <motion.div
            key="email"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-8"
          >
            {!emailConfig.connected ? (
              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <HiOutlineEnvelope className="w-16 h-16 text-primary mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">Connect Your Email</h3>
                <p className="text-muted-foreground mb-6">
                  Connect your email to automatically import invoice attachments
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={connectEmail}
                  disabled={emailConfig.fetching}
                  className="btn-gradient px-8"
                >
                  {emailConfig.fetching ? (
                    <span className="flex items-center gap-2">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                        <HiOutlineSparkles className="w-5 h-5" />
                      </motion.div>
                      Connecting...
                    </span>
                  ) : (
                    'Connect Email'
                  )}
                </motion.button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                  <HiOutlineCheckCircle className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Connected</h3>
                <p className="text-muted-foreground mb-2">{emailConfig.email}</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Click below to scan your inbox for invoice attachments
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={fetchFromEmail}
                  disabled={emailConfig.fetching}
                  className="btn-gradient px-8"
                >
                  {emailConfig.fetching ? (
                    <span className="flex items-center gap-2">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                        <HiOutlineSparkles className="w-5 h-5" />
                      </motion.div>
                      Scanning Inbox...
                    </span>
                  ) : (
                    'Fetch Invoices from Email'
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        {/* Extracted Data Display */}
        {extractedData && uploadMode === 'single' && (
          <motion.div
            key="extracted"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <motion.div 
              className="glass-card p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
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
            </motion.div>

            <motion.div 
              className="glass-card p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4">Extracted Fields</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {extractedData.fields.map((field: any, index: number) => (
                  <motion.div 
                    key={field.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-lg bg-muted/30 border border-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{field.key}</span>
                      <ConfidenceBadge confidence={field.confidence} explanation={field.explanation} size="sm" showLabel={false} />
                    </div>
                    <p className="font-medium">{field.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApprove} 
                className="btn-gradient flex-1 flex items-center justify-center gap-2"
              >
                <HiOutlineCheckCircle className="w-5 h-5" />
                {extractedData.overallConfidence >= confidenceThresholds.autoApprove ? 'Approve & Archive' : 'Send to Review'}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setExtractedData(null)} 
                className="px-6 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Upload Another
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Upload;
