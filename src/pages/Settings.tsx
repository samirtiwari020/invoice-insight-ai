import React from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const { confidenceThresholds, setConfidenceThresholds } = useInvoiceStore();

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure AI thresholds and system preferences</p>
      </div>

      <div className="glass-card p-6 space-y-6">
        <h3 className="text-lg font-semibold">Confidence Thresholds</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Auto-Approval Threshold: {confidenceThresholds.autoApprove}%</label>
            <input
              type="range"
              min="70"
              max="99"
              value={confidenceThresholds.autoApprove}
              onChange={(e) => setConfidenceThresholds({ ...confidenceThresholds, autoApprove: parseInt(e.target.value) })}
              className="w-full accent-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">Invoices with confidence ≥ this value are auto-approved</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Review Threshold: {confidenceThresholds.review}%</label>
            <input
              type="range"
              min="40"
              max="80"
              value={confidenceThresholds.review}
              onChange={(e) => setConfidenceThresholds({ ...confidenceThresholds, review: parseInt(e.target.value) })}
              className="w-full accent-warning"
            />
            <p className="text-xs text-muted-foreground mt-1">Invoices between this and auto-approval go to review queue</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary rounded" />
          <span>Email on low-confidence extractions</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary rounded" />
          <span>Daily digest of pending reviews</span>
        </label>
      </div>

      <button onClick={handleSave} className="btn-gradient w-full">Save Settings</button>
    </div>
  );
};

export default Settings;
