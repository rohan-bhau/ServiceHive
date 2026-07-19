'use client';
import { cn } from '@/lib/utils';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface RatingProps {
  value: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export default function Rating({ value, count, size = 'md', interactive, onChange }: RatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="inline-flex items-center gap-0.5">
      {stars.map((star) => {
        const filled = star <= Math.floor(value);
        const half = !filled && star === Math.ceil(value) && value % 1 >= 0.25;

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(star)}
            className={cn(
              'text-yellow-400 transition-colors',
              interactive && 'cursor-pointer hover:text-yellow-300',
              !interactive && 'cursor-default',
            )}
          >
            {filled ? (
              <StarSolid className={cn(sizeStyles[size])} />
            ) : half ? (
              <span className="relative">
                <StarOutline className={cn(sizeStyles[size], 'text-yellow-400')} />
                <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                  <StarSolid className={cn(sizeStyles[size], 'text-yellow-400')} />
                </span>
              </span>
            ) : (
              <StarOutline className={cn(sizeStyles[size], 'text-yellow-400')} />
            )}
          </button>
        );
      })}
      {count !== undefined && (
        <span className="ml-1.5 text-sm text-gray-500">({count})</span>
      )}
    </div>
  );
}
