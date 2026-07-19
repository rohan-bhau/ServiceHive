'use client';
import { useParams } from 'next/navigation';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';

export default function ServiceDetailPage() {
  const { id } = useParams();

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton height="360px" />
          <div className="mt-6 space-y-4">
            <Skeleton width="60%" height="32px" />
            <Skeleton width="30%" height="24px" />
            <Skeleton height="80px" />
            <Skeleton height="120px" />
          </div>
        </div>
        <div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <Skeleton width="50%" height="28px" />
            <Skeleton width="100%" height="48px" className="mt-4" />
            <Skeleton width="100%" height="48px" className="mt-2" />
          </div>
        </div>
      </div>
    </main>
  );
}
