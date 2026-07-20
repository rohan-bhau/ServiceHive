'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { useEffect } from 'react';

const roleRouteMap: Record<string, string[]> = {
  admin: ['/admin'],
  provider: ['/services/add', '/services/manage'],
};

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push('/login?redirect=' + pathname); return; }

    if (pathname.startsWith('/admin') && user.role !== 'admin') {
      router.push('/unauthorized');
    } else if ((pathname.startsWith('/services/add') || pathname.startsWith('/services/manage')) && user.role !== 'provider') {
      router.push('/unauthorized');
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading || !user) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  const showSidebar = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {showSidebar && <DashboardSidebar />}
      <div className={`flex-1 ${showSidebar ? 'lg:ml-64' : ''}`}>
        {children}
      </div>
    </div>
  );
}
