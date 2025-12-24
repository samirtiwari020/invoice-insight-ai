import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

export const Footer: React.FC = () => {
  const { sidebarOpen } = useUIStore();
  const { dashboardMetrics } = useInvoiceStore();

  return (
    <footer 
      className={cn(
        'fixed bottom-0 right-0 z-20 h-12 bg-card/60 backdrop-blur-xl border-t border-border transition-all duration-300',
        sidebarOpen ? 'left-64' : 'left-20'
      )}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Left - Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <HiOutlineSparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">HackXios</span>
          </div>
          <span className="text-xs text-muted-foreground">|</span>
          <span className="text-xs text-muted-foreground">Enterprise AP Automation</span>
        </div>

        {/* Center - Live Stats */}
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-muted-foreground">AI Engine: <span className="text-success font-medium">Online</span></span>
          </div>
          <div className="text-muted-foreground">
            <span className="font-medium text-foreground">{dashboardMetrics.totalInvoices}</span> invoices processed
          </div>
          <div className="text-muted-foreground">
            <span className="font-medium text-foreground">{dashboardMetrics.averageConfidence.toFixed(1)}%</span> avg confidence
          </div>
        </div>

        {/* Right - Links */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/hackxios"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors"
            >
              <FaGithub className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors"
            >
              <FaLinkedin className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors"
            >
              <FaTwitter className="w-4 h-4" />
            </a>
          </div>
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} HackXios
          </span>
        </div>
      </div>
    </footer>
  );
};
