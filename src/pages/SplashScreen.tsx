import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SplashScreen: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    // Hold splash screen for 1.8 seconds to display animations
    const timer = setTimeout(() => {
      setAnimationFinished(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (animationFinished && !loading) {
      if (user) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [animationFinished, loading, user, navigate]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 flex flex-col items-center justify-center text-white select-none">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Glowing Logo */}
        <div className="relative animate-bounce">
          <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-40 animate-pulse" />
          <div className="relative w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
            <Receipt size={36} className="text-white" />
          </div>
        </div>

        {/* Brand Text */}
        <div className="text-center flex flex-col gap-1.5">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
            Spenda
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400/80">
            Smart Expense Hub
          </p>
        </div>

        {/* Mini progress line indicator */}
        <div className="w-28 h-1 bg-slate-800 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-blue-500 rounded-full w-0 animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
      
      {/* Adding custom keyframes dynamically for tailwind loading width */}
      <style>{`
        @keyframes loading {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 50%; margin-left: 25%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
};
