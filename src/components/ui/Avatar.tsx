import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  status?: 'online' | 'offline' | 'busy' | 'away';
  ring?: boolean;
  ringColor?: 'primary' | 'gold' | 'red' | 'purple';
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      children,
      src,
      alt = '',
      size = 'md',
      status,
      ring = false,
      ringColor = 'primary',
      className,
      ...props
    },
    ref
  ) => {
    const sizes = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl',
      '2xl': 'w-24 h-24 text-3xl',
      full: 'w-full h-full text-5xl',
    };

    const ringColors = {
      primary: 'ring-primary-500',
      gold: 'ring-gold-500',
      red: 'ring-red-500',
      purple: 'ring-purple-500',
    };

    const statusColors = {
      online: 'bg-green-500',
      offline: 'bg-dark-500',
      busy: 'bg-red-500',
      away: 'bg-yellow-500',
    };

    const statusSizes = {
      xs: 'w-2 h-2 border-2 border-dark-900',
      sm: 'w-2.5 h-2.5 border-2 border-dark-900',
      md: 'w-3 h-3 border-2 border-dark-900',
      lg: 'w-3.5 h-3.5 border-[3px] border-dark-900',
      xl: 'w-4 h-4 border-4 border-dark-900',
      '2xl': 'w-5 h-5 border-[4px] border-dark-900',
      full: 'w-6 h-6 border-[6px] border-dark-900',
    };

    return (
      <div ref={ref} className={cn('relative inline-block', className)} {...props}>
        <div
          className={cn(
            'rounded-full overflow-hidden bg-dark-700 flex items-center justify-center font-semibold text-white',
            sizes[size],
            ring && `ring-2 ring-offset-2 ring-offset-dark-900 ${ringColors[ringColor]}`
          )}
        >
          {src ? (
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
            />
          ) : (
            children || (
              <span className="opacity-50">
                {(alt || 'U').charAt(0).toUpperCase()}
              </span>
            )
          )}
        </div>
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full border-dark-900',
              statusColors[status],
              statusSizes[size]
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  avatars: Array<{
    src?: string | null;
    alt?: string;
    status?: 'online' | 'offline' | 'busy' | 'away';
  }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ avatars, max = 5, size = 'md', className, ...props }, ref) => {
    const visibleAvatars = avatars.slice(0, max);
    const remainingCount = avatars.length - max;

    const sizeClasses = {
      xs: '-space-x-1',
      sm: '-space-x-2',
      md: '-space-x-3',
      lg: '-space-x-4',
    };

    return (
      <div ref={ref} className={cn('flex', sizeClasses[size], className)} {...props}>
        {visibleAvatars.map((avatar, index) => (
          <Avatar
            key={index}
            src={avatar.src}
            alt={avatar.alt}
            size={size}
            status={avatar.status}
            className="ring-2 ring-dark-900"
          />
        ))}
        {remainingCount > 0 && (
          <Avatar size={size} className="bg-dark-600 ring-2 ring-dark-900">
            +{remainingCount}
          </Avatar>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarGroup };
export type { AvatarProps, AvatarGroupProps };
