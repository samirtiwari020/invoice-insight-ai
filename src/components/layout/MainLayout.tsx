import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

export const MainLayout: React.FC = () => {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Navbar />
      
      <main 
        className={cn(
          'pt-16 pb-12 min-h-screen transition-all duration-300',
          sidebarOpen ? 'ml-64' : 'ml-20'
        )}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};
