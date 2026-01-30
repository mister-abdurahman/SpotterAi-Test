import React, { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button = ({ className, variant = 'primary', size = 'md', children, ...props }: ButtonProps) => {
  const variants = {
    primary: 'bg-brand-teal text-brand-darker-blue hover:bg-brand-teal/90 shadow-lg shadow-brand-teal/10',
    secondary: 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-700',
    outline: 'bg-transparent text-brand-teal border border-brand-teal hover:bg-brand-teal/10',
    ghost: 'bg-transparent text-slate-500 hover:bg-slate-800 hover:text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-bold uppercase tracking-wider',
    md: 'px-4 py-2 font-bold',
    lg: 'px-6 py-3 text-lg font-bold',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-brand-teal/50 disabled:opacity-50 disabled:pointer-events-none active:scale-95',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ className, label, error, ...props }: InputProps) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">{label}</label>}
      <input
        className={cn(
          'w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all',
          error && 'border-red-500 focus:ring-red-200/20',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("animate-pulse rounded-2xl bg-slate-800", className)}
      {...props}
    />
  );
};
