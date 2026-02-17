import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'default' | 'primary' | 'gold' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  striped?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      children,
      className,
      value = 0,
      max = 100,
      variant = 'default',
      size = 'md',
      showLabel = false,
      label,
      animated = false,
      striped = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const sizes = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    };

    const variants = {
      default: 'bg-dark-600',
      primary: 'bg-primary-500',
      gold: 'bg-gradient-to-r from-gold-500 to-gold-600',
      success: 'bg-green-500',
      danger: 'bg-red-500',
    };

    const barVariants = {
      default: 'bg-primary-500',
      primary: 'bg-primary-400',
      gold: 'bg-gradient-to-r from-gold-400 to-gold-500',
      success: 'bg-green-400',
      danger: 'bg-red-400',
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {(showLabel || label) && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-dark-300">
              {label || `${Math.round(percentage)}%`}
            </span>
            {showLabel && (
              <span className="text-sm font-medium text-dark-200">
                {Math.round(value)} / {max}
              </span>
            )}
          </div>
        )}
        <div
          className={cn(
            'w-full rounded-full overflow-hidden bg-dark-800',
            sizes[size]
          )}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              barVariants[variant],
              animated && 'animate-pulse-slow',
              striped && 'bg-stripes'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {children}
      </div>
    );
  }
);

Progress.displayName = 'Progress';

// XP Progress Component
interface XPProgressProps {
  currentXP: number;
  levelXP: number;
  level: number;
  nextLevelXP?: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const XPProgress: React.FC<XPProgressProps> = ({
  currentXP,
  levelXP,
  level,
  nextLevelXP,
  showDetails = true,
  size = 'md',
}) => {
  const percentage = (currentXP / levelXP) * 100;

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {/* Level Badge */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className={cn(
            'relative w-10 h-10 rounded-xl',
            'bg-gradient-to-br from-primary-500 to-primary-600',
            'flex items-center justify-center',
            'text-lg font-bold text-white',
            'shadow-lg shadow-primary-500/30'
          )}
        >
          {level}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gold-500 rounded-full flex items-center justify-center">
            <span className="text-[8px]">⭐</span>
          </div>
        </div>
        
        {showDetails && (
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold text-dark-200">
                XP Progress
              </span>
              <span className="text-xs text-dark-400">
                {currentXP.toLocaleString()} / {levelXP.toLocaleString()} XP
              </span>
            </div>
            <div
              className={cn(
                'w-full rounded-full overflow-hidden bg-dark-800',
                sizeClasses[size]
              )}
            >
              <div
                className={cn(
                  'h-full rounded-full',
                  'bg-gradient-to-r from-primary-500 to-green-400',
                  'shadow-lg shadow-primary-500/30',
                  'transition-all duration-500'
                )}
                style={{ width: `${Math.min(100, percentage)}%` }}
              />
            </div>
            {nextLevelXP && (
              <div className="flex justify-between mt-1">
                <span className="text-xs text-dark-500">
                  Level {level}
                </span>
                <span className="text-xs text-dark-500">
                  Level {level + 1} at {nextLevelXP.toLocaleString()} XP
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

XPProgress.displayName = 'XPProgress';

// Circular Progress Component
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'primary' | 'gold' | 'success';
  showLabel?: boolean;
  label?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'primary',
  showLabel = true,
  label,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colors = {
    default: 'stroke-primary-500',
    primary: 'stroke-primary-500',
    gold: 'stroke-gold-500',
    success: 'stroke-green-500',
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-dark-800"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn('transition-all duration-500', colors[variant])}
        />
      </svg>
      
      {/* Label */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {Math.round(percentage)}%
          </span>
          {label && (
            <span className="text-xs text-dark-400 mt-1">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

CircularProgress.displayName = 'CircularProgress';

export { Progress, XPProgress, CircularProgress };
export type { ProgressProps, XPProgressProps, CircularProgressProps };
