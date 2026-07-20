'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/auth';
import { useLogoutMutation } from '@/store/api/authApi';
import Avatar from '@/components/ui/Avatar';
import { showToast } from '@/lib/utils';

const roleNavLinks: Record<string, { href: string; label: string }[]> = {
  admin: [
    { href: '/admin/dashboard', label: 'Platform Overview' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/services', label: 'Pending Services' },
    { href: '/profile', label: 'Profile' },
  ],
  provider: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/services/manage', label: 'My Services' },
    { href: '/services/add', label: 'Add Service' },
    { href: '/profile', label: 'Profile' },
  ],
  customer: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/explore', label: 'Explore' },
    { href: '/profile', label: 'Profile' },
  ],
};

export default function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout(undefined);
    showToast.success('Logged out successfully');
    router.push('/');
  };

  const links = user ? roleNavLinks[user.role] || roleNavLinks.customer : [];
  const isActive = (href: string) => {
    const [basePath] = href.split('?');
    return pathname === basePath || pathname.startsWith(basePath + '/');
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
        <Avatar name={user?.name} src={user?.avatarUrl} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">{user?.name}</p>
          <p className="truncate text-xs text-gray-400">{user?.email}</p>
        </div>
        {user?.role && (
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium capitalize text-primary">
            {user.role}
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive(link.href)
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-100 px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed left-4 top-20 z-40 rounded-lg border border-gray-200 bg-white p-2 shadow-sm lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {mobileOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-gray-100 bg-white lg:fixed lg:inset-y-16 lg:flex lg:flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/30 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-16 left-0 z-40 w-64 border-r border-gray-100 bg-white shadow-xl lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
