'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { useEffect } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push('/login?redirect=' + pathname); return; }
  }, [user, isLoading, pathname, router]);

  if (isLoading || !user) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  const showSidebar = pathname.startsWith('/admin') || pathname.includes('/dashboard');

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {showSidebar && <DashboardSidebar />}
      <div className={`flex-1 ${showSidebar ? 'lg:ml-64' : ''}`}>
        {children}
      </div>
    </div>
  );
}
