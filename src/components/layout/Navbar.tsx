import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HiOutlineQuestionMarkCircle,
  HiOutlineCog6Tooth,
  HiOutlineBell,
  HiOutlineChevronRight,
} from 'react-icons/hi2';
import { FaGithub } from 'react-icons/fa';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';
import { Switch } from '@headlessui/react';

const getBreadcrumbs = (pathname: string): { label: string; path: string }[] => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: { label: string; path: string }[] = [
    { label: 'Home', path: '/' }
  ];
  
  let currentPath = '';
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    breadcrumbs.push({ label, path: currentPath });
  });
  
  return breadcrumbs;
};

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { sidebarOpen } = useUIStore();
  const { isExecutiveMode, toggleExecutiveMode, dashboardMetrics } = useInvoiceStore();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <header 
      className={cn(
        'fixed top-0 right-0 z-30 h-16 bg-card/80 backdrop-blur-xl border-b border-border transition-all duration-300',
        sidebarOpen ? 'left-64' : 'left-20'
      )}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && (
                <HiOutlineChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium text-foreground">{crumb.label}</span>
              ) : (
                <Link 
                  to={crumb.path} 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Executive Mode Toggle */}
          {location.pathname.includes('dashboard') && (
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Executive Mode</span>
              <Switch
                checked={isExecutiveMode}
                onChange={toggleExecutiveMode}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  isExecutiveMode ? 'bg-primary' : 'bg-muted-foreground/30'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-card shadow-md transition-transform',
                    isExecutiveMode ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </Switch>
            </div>
          )}

          {/* Pending Review Badge */}
          {dashboardMetrics.pendingReview > 0 && (
            <Link 
              to="/review-queue"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 text-warning text-sm font-medium hover:bg-warning/20 transition-colors"
            >
              <HiOutlineBell className="w-4 h-4" />
              <span>{dashboardMetrics.pendingReview} pending</span>
            </Link>
          )}

          {/* GitHub Link */}
          <a
            href="https://github.com/hackxios"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            title="View on GitHub"
          >
            <FaGithub className="w-5 h-5" />
          </a>

          {/* Help */}
          <button 
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            title="Help & Documentation"
          >
            <HiOutlineQuestionMarkCircle className="w-5 h-5" />
          </button>

          {/* Settings */}
          <Link 
            to="/settings"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            title="Settings"
          >
            <HiOutlineCog6Tooth className="w-5 h-5" />
          </Link>

          {/* Version Badge */}
          <span className="px-2 py-1 rounded text-xs font-mono bg-primary/10 text-primary">
            v2.1.0
          </span>
        </div>
      </div>
    </header>
  );
};
