import { InputHTMLAttributes, forwardRef } from 'react';

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl
          bg-white placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-opacity-20 focus:border-slate-400
          transition-all duration-150
          disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
          ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
