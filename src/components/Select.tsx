import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', options, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl
          bg-white text-slate-700
          focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-opacity-20 focus:border-slate-400
          transition-all duration-150 cursor-pointer
          disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
          ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = 'Select';

export default Select;
