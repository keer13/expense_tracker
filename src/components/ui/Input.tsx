import React, { forwardRef } from 'react';
import type { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, className = '', ...props }, ref) => {
    const errorId = error ? `${props.id || props.name}-error` : undefined;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left animate-fade-in">
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-xl">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Icon size={18} />
            </div>
          )}
          <input
            ref={ref}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={errorId}
            className={`
              w-full py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800
              bg-white/80 dark:bg-slate-900/60
              text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500
              input-focus-ring text-base
              ${Icon ? 'pl-10.5' : ''}
              ${error ? 'border-rose-500 dark:border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <span
            id={errorId}
            className="text-xs text-rose-500 font-medium pl-1 animate-fade-in"
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
