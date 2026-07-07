import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  User, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, logout, isDemo } = useAuth();

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/expenses', label: 'Expenses', icon: Receipt },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-full bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800/80 flex flex-col justify-between p-6 select-none">
      {/* Brand Header */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Receipt size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Spenda
              </h1>
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Expense Hub
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Demo Mode Badge */}
        {isDemo && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
            <Sparkles size={14} className="shrink-0" />
            <span className="text-xs font-semibold">Demo (Local Storage)</span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onCloseMobile}
              className={({ isActive }) => `
                flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'}
              `}
            >
              <link.icon size={18} className="shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Profile & Logout Section */}
      <div className="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-6">
        {user && (
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {user.displayName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                {user.displayName || 'User'}
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}
        
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-500 dark:text-rose-400 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 transition-colors cursor-pointer w-full text-left"
        >
          <LogOut size={18} className="shrink-0" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
