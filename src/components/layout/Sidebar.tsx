import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HiOutlineSquares2X2,
  HiOutlineCloudArrowUp,
  HiOutlineClock,
  HiOutlineClipboardDocumentCheck,
  HiOutlineChartBarSquare,
  HiOutlineArchiveBox,
  HiOutlineCog6Tooth,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineDocumentText,
} from 'react-icons/hi2';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineSquares2X2 },
  { path: '/upload', label: 'Upload', icon: HiOutlineCloudArrowUp },
  { path: '/processing', label: 'Processing Queue', icon: HiOutlineClock },
  { path: '/review-queue', label: 'Review Queue', icon: HiOutlineClipboardDocumentCheck },
  { path: '/analytics', label: 'Analytics', icon: HiOutlineChartBarSquare },
  { path: '/history', label: 'History', icon: HiOutlineArchiveBox },
  { path: '/settings', label: 'Settings', icon: HiOutlineCog6Tooth },
];

export const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-primary transition-all duration-300 flex flex-col',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-primary-foreground/10">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
            <HiOutlineDocumentText className="w-5 h-5 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <span className="font-bold text-primary-foreground text-lg slide-in-left">InvoiceAI</span>
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
                isActive ? 'text-primary-foreground' : 'text-primary-foreground/70 group-hover:text-primary-foreground'
              )} />
              {sidebarOpen && (
                <span className={cn(
                  'transition-colors text-sm',
                  isActive ? 'text-primary-foreground font-medium' : 'text-primary-foreground/80 group-hover:text-primary-foreground'
                )}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors shadow-md"
      >
        {sidebarOpen ? (
          <HiOutlineChevronLeft className="w-4 h-4 text-foreground" />
        ) : (
          <HiOutlineChevronRight className="w-4 h-4 text-foreground" />
        )}
      </button>
    </aside>
  );
};
