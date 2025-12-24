import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HiOutlineHome,
  HiOutlineCloudArrowUp,
  HiOutlineArrowPath,
  HiOutlineClipboardDocumentCheck,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineSparkles,
} from 'react-icons/hi2';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { path: '/upload', label: 'Upload', icon: HiOutlineCloudArrowUp },
  { path: '/processing', label: 'Processing', icon: HiOutlineArrowPath },
  { path: '/review-queue', label: 'Review Queue', icon: HiOutlineClipboardDocumentCheck },
  { path: '/history', label: 'History', icon: HiOutlineClock },
  { path: '/analytics', label: 'Analytics', icon: HiOutlineChartBar },
  { path: '/settings', label: 'Settings', icon: HiOutlineCog6Tooth },
];

export const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <HiOutlineSparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <div className="flex flex-col slide-in-left">
              <span className="font-bold text-sidebar-foreground text-lg">InvoiceAI</span>
              <span className="text-xs text-sidebar-foreground/60">by HackXios</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === '/processing' && location.pathname.startsWith('/processing/'));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'nav-item group',
                isActive && 'nav-item-active'
              )}
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon className={cn(
                'w-5 h-5 shrink-0 transition-colors',
                isActive ? 'text-primary' : 'text-sidebar-foreground/70 group-hover:text-sidebar-foreground'
              )} />
              {sidebarOpen && (
                <span className={cn(
                  'transition-colors',
                  isActive ? 'text-primary' : 'text-sidebar-foreground/80 group-hover:text-sidebar-foreground'
                )}>
                  {item.label}
                </span>
              )}
              {isActive && sidebarOpen && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* AI Status */}
      <div className={cn(
        'mx-3 mb-4 p-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border',
        !sidebarOpen && 'p-2'
      )}>
        {sidebarOpen ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground">AI Engine Active</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">v2.1 • 99.9% uptime</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-3 h-3 rounded-full bg-success animate-pulse" />
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border flex items-center justify-center hover:bg-sidebar-accent transition-colors shadow-md"
      >
        {sidebarOpen ? (
          <HiOutlineChevronLeft className="w-4 h-4 text-sidebar-foreground" />
        ) : (
          <HiOutlineChevronRight className="w-4 h-4 text-sidebar-foreground" />
        )}
      </button>
    </aside>
  );
};
