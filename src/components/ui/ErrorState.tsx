'use client';
import Button from './Button';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'Something went wrong while loading data.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/50 py-16 text-center px-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
        <ExclamationTriangleIcon className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">Failed to Load</h3>
      <p className="mt-2 max-w-sm text-sm text-gray-500">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-6 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
          Try Again
        </Button>
      )}
    </div>
  );
}
