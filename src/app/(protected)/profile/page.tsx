'use client';
import { useAuth } from '@/lib/auth';
import Avatar from '@/components/ui/Avatar';
import Skeleton from '@/components/ui/Skeleton';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="p-6"><Skeleton height="200px" /></div>;

  return (
    <main className="mx-auto max-w-2xl space-y-8 p-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      <div className="flex items-center gap-6 rounded-2xl bg-white p-6 shadow-sm">
        <Avatar name={user?.name} src={user?.avatarUrl} size="lg" />
        <div>
          <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
          <p className="text-gray-600">{user?.email}</p>
          <span className="mt-1 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm capitalize text-primary">
            {user?.role || 'customer'}
          </span>
        </div>
      </div>
    </main>
  );
}
