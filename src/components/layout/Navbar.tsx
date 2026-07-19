'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useGetMeQuery, useLogoutMutation } from '@/store/api/authApi';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { showToast } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/explore', label: 'Explore' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: user, isLoading } = useGetMeQuery(undefined, { skip: typeof window === 'undefined' });
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout(undefined);
    showToast.success('Logged out');
    router.push('/');
  };

  const authLinks = user
    ? [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/services/add', label: 'Add Service' },
        { href: '/ai/assistant', label: 'AI Assistant' },
        { href: '/profile', label: 'Profile' },
      ]
    : [];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="relative text-xl font-bold tracking-tight text-gray-900">
          Service<span className="text-primary">Hive</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="mx-3 h-5 w-px bg-gray-200" />
          {authLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {!isLoading && (
            <div className="ml-2 flex items-center gap-3">
              {user ? (
                <>
                  <button onClick={handleLogout} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-red-600">
                    Logout
                  </button>
                  <Link href="/profile">
                    <Avatar name={user.name} src={user.avatarUrl} size="sm" className="ring-2 ring-white shadow-sm cursor-pointer transition-transform hover:scale-105" />
                  </Link>
                </>
              ) : (
                <Link href="/login">
                  <Button size="sm">Sign In</Button>
                </Link>
              )}
            </div>
          )}
        </div>

        <button
          className="relative z-50 rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-gray-100 bg-white md:hidden"
          >
            <div className="space-y-1 px-4 pb-6 pt-2">
              {[...NAV_LINKS, ...authLinks].map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="border-t border-gray-100 pt-3">
                {user ? (
                  <button onClick={handleLogout} className="block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
                    Logout
                  </button>
                ) : (
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="block rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-white">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
