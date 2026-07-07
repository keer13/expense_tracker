import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  hoverable = false, 
  glass = true, 
  className = '', 
  ...props 
}) => {
  return (
    <div
      className={`
        rounded-2xl p-6 shadow-xs border border-slate-100 dark:border-slate-800/60
        ${glass ? 'glass' : 'bg-white dark:bg-slate-900'}
        ${hoverable ? 'hover:shadow-md hover:scale-[1.01] hover:border-slate-200 dark:hover:border-slate-700/60 transition-all duration-300' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
