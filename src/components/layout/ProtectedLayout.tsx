import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Spinner } from '../ui/Spinner';

export const ProtectedLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium animate-pulse">
          Syncing records...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block h-full shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Drawer Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-xs animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer Sidebar */}
          <div className="relative h-full animate-fade-in shrink-0">
            <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-[-48px] p-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800/80 shadow-md cursor-pointer"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Header */}
        <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:p-8">
          <div className="max-w-6xl mx-auto w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
