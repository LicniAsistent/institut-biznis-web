import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 
    | 'default' 
    | 'primary' 
    | 'success' 
    | 'warning' 
    | 'danger' 
    | 'gold' 
    | 'purple'
    | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  dot?: boolean;
  icon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      className,
      variant = 'default',
      size = 'md',
      rounded = false,
      dot = false,
      icon,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: 'bg-dark-700 text-dark-200',
      primary: 'bg-primary-500/20 text-primary-400 border border-primary-500/30',
      success: 'bg-green-500/20 text-green-400 border border-green-500/30',
      warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
      gold: 'bg-gradient-to-r from-gold-500/20 to-gold-600/20 text-gold-400 border border-gold-500/30',
      purple: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      ghost: 'bg-transparent text-dark-400',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs gap-1',
      md: 'px-3 py-1 text-sm gap-1.5',
      lg: 'px-4 py-1.5 text-base gap-2',
    };

    const dotColors = {
      default: 'bg-dark-500',
      primary: 'bg-primary-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500',
      gold: 'bg-gold-500',
      purple: 'bg-purple-500',
      ghost: 'bg-dark-500',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          variants[variant],
          sizes[size],
          rounded && 'rounded-full',
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])}
          />
        )}
        {icon && <span className="mr-1">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Rank Badge Component
interface RankBadgeProps {
  rank: {
    name: string;
    level: number;
    color: string;
  };
  showLevel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const RankBadge: React.FC<RankBadgeProps> = ({
  rank,
  showLevel = true,
  size = 'md',
  interactive = false,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const fontSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  // Map level to size class
  const getSizeClass = (level: number) => {
    if (level <= 2) return 'sm';
    if (level <= 5) return 'md';
    return 'lg';
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full',
        'bg-gradient-to-br from-primary-500 to-primary-600',
        'shadow-lg shadow-primary-500/25',
        sizeClasses[getSizeClass(rank.level)],
        interactive && 'cursor-pointer hover:scale-110 transition-transform'
      )}
      title={`Rank: ${rank.name}`}
    >
      <span
        className={cn(
          'font-bold text-white drop-shadow-md',
          fontSizes[size]
        )}
      >
        {rank.level}
      </span>
      
      {/* Glow effect */}
      <div
        className={cn(
          'absolute inset-0 rounded-full',
          'bg-primary-500 blur-md opacity-50'
        )}
      />
    </div>
  );
};

RankBadge.displayName = 'RankBadge';

// Achievement Badge Component
interface AchievementBadgeProps {
  icon: string | React.ReactNode;
  name: string;
  description?: string;
  unlocked?: boolean;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const achievementRarities = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-gold-400 to-orange-500',
};

const achievementGlows = {
  common: '',
  rare: 'shadow-blue-500/30',
  epic: 'shadow-purple-500/40',
  legendary: 'shadow-gold-500/50 animate-pulse-slow',
};

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  icon,
  name,
  description,
  unlocked = true,
  rarity = 'common',
  size = 'md',
  onClick,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const iconSizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  return (
    <div
      className={cn(
        'relative flex flex-col items-center',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      {/* Badge */}
      <div
        className={cn(
          'relative rounded-xl bg-gradient-to-br flex items-center justify-center',
          achievementRarities[rarity],
          sizeClasses[size],
          'shadow-lg',
          achievementGlows[rarity],
          !unlocked && 'grayscale opacity-50'
        )}
      >
        <span className={cn(iconSizes[size], 'drop-shadow-lg')}>
          {typeof icon === 'string' ? icon : icon}
        </span>
        
        {/* Shine effect for legendary */}
        {rarity === 'legendary' && (
          <div
            className={cn(
              'absolute inset-0 rounded-xl',
              'bg-gradient-to-r from-transparent via-white/20 to-transparent',
              'animate-shimmer'
            )}
          />
        )}
      </div>

      {/* Name */}
      {name && (
        <span
          className={cn(
            'mt-2 text-xs font-medium text-center max-w-20',
            unlocked ? 'text-dark-200' : 'text-dark-500'
          )}
        >
          {name}
        </span>
      )}
    </div>
  );
};

AchievementBadge.displayName = 'AchievementBadge';

export { Badge, RankBadge, AchievementBadge };
export type { BadgeProps, RankBadgeProps, AchievementBadgeProps };
