import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient' | 'glass' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className,
      variant = 'default',
      padding = 'md',
      hover = false,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      rounded-xl overflow-hidden
    `;

    const variants = {
      default: `
        bg-dark-800 border border-dark-700
      `,
      gradient: `
        bg-gradient-to-br from-dark-800 to-dark-900
        border border-dark-700
        shadow-xl shadow-black/20
      `,
      glass: `
        bg-dark-800/80 backdrop-blur-xl
        border border-dark-700/50
      `,
      interactive: `
        bg-dark-800 border border-dark-700
        hover:border-primary-500/50
        hover:shadow-lg hover:shadow-primary-500/10
        hover:-translate-y-0.5
        transition-all duration-300
      `,
    };

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          paddings[padding],
          hover && 'cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    {
      children,
      title,
      description,
      icon,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('mb-4', className)}
        {...props}
      >
        {(title || icon) && (
          <div className="flex items-center gap-3 mb-2">
            {icon && (
              <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-500">
                {icon}
              </div>
            )}
            {title && (
              <h3 className="text-xl font-bold text-white">
                {title}
              </h3>
            )}
          </div>
        )}
        {description && (
          <p className="text-dark-400 text-sm">
            {description}
          </p>
        )}
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'transparent';
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'pt-4 border-t border-dark-700 mt-4',
      bordered: 'pt-4 border-t border-dark-700/50 mt-4',
      transparent: 'pt-4 mt-4',
    };

    return (
      <div
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardBody, CardFooter };
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps };
