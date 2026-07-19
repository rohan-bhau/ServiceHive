import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({ className, hover, padding = 'md', children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white shadow-sm border border-gray-100',
        paddingStyles[padding],
        hover && 'transition-shadow duration-200 hover:shadow-md',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
