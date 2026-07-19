'use client';
import { useAuth } from '@/lib/auth';
import Skeleton from '@/components/ui/Skeleton';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <Skeleton width="200px" height="32px" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} height="120px" />)}
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-600">
        Welcome{user?.name ? `, ${user.name}` : ''}! Use the sidebar to navigate.
      </p>
    </main>
  );
}
