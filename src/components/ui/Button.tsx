import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center font-semibold rounded-lg
      transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-95
    `;

    const variants = {
      primary: `
        bg-primary-600 text-white
        hover:bg-primary-700
        focus:ring-primary-500
        shadow-lg shadow-primary-500/25
        hover:shadow-xl hover:shadow-primary-500/30
      `,
      secondary: `
        bg-dark-700 text-white
        hover:bg-dark-600
        focus:ring-dark-500
      `,
      outline: `
        border-2 border-primary-600 text-primary-600
        hover:bg-primary-600 hover:text-white
        focus:ring-primary-500
      `,
      ghost: `
        text-dark-300
        hover:bg-dark-700 hover:text-white
        focus:ring-dark-500
      `,
      danger: `
        bg-red-600 text-white
        hover:bg-red-700
        focus:ring-red-500
        shadow-lg shadow-red-500/25
      `,
      gold: `
        bg-gradient-to-r from-gold-500 to-gold-600 text-white
        hover:from-gold-600 hover:to-gold-700
        focus:ring-gold-500
        shadow-lg shadow-gold-500/30
      `,
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5',
      xl: 'px-8 py-4 text-xl gap-3',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 2.465 5.546 5.573 5.546A8 8 0 0016 12v-1.709z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {rightIcon && !loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
