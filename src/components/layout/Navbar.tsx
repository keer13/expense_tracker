import React from 'react';
import { Menu, Receipt } from 'lucide-react';

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  return (
    <header className="md:hidden w-full h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white">
          <Receipt size={18} />
        </div>
        <span className="font-bold text-slate-900 dark:text-slate-100 text-lg">Spenda</span>
      </div>
      
      <button
        onClick={onOpenMobileMenu}
        className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>
    </header>
  );
};
