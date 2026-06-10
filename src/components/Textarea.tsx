import { TextareaHTMLAttributes, forwardRef } from 'react';

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full px-4 py-3 text-sm border border-slate-200 rounded-xl
          bg-white placeholder:text-slate-400 resize-none
          focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-opacity-20 focus:border-slate-400
          transition-all duration-150
          disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
          ${className}`}
        rows={4}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
