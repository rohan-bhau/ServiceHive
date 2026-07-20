'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/auth';
import { useLogoutMutation } from '@/store/api/authApi';
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [logout] = useLogoutMutation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Close dropdown on click outside
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    await logout(undefined);
    showToast.success('Logged out successfully');
    router.push('/');
  };

  const authLinks = user
    ? [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/services/add', label: 'Add Service' },
        ...(user.role === 'provider' ? [{ href: '/services/manage', label: 'Manage' }] : []),
      ]
    : [];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/85 backdrop-blur-xl" aria-label="Main navigation">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="relative text-xl font-bold tracking-tight text-gray-900 font-display" aria-label="ServiceHive Home">
          Service<span className="text-primary">Hive</span>
        </Link>

        {/* Desktop links */}
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
          {mounted && !isLoading && (
            <div className="ml-2 flex items-center gap-3">
              {user ? (
                /* Profile Avatar Dropdown */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    aria-label="User menu"
                    className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <Avatar
                      name={user.name}
                      src={user.avatarUrl}
                      size="sm"
                      className="ring-2 ring-white shadow-sm cursor-pointer transition-transform hover:scale-105"
                    />
                  </button>
                    <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-gray-100 bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
                        role="menu"
                      >
                        <div className="px-4 py-2 border-b border-gray-50">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Dashboard
                        </Link>
                        <hr className="border-gray-50" />
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            handleLogout();
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login">
                  <Button size="sm">Sign In</Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          className="relative z-50 rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-gray-100 bg-white md:hidden"
            id="mobile-menu"
            role="menu"
          >
            <div className="space-y-1 px-4 pb-6 pt-2">
              {[...NAV_LINKS, ...authLinks].map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {user && (
                <Link
                  href="/profile"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    pathname === '/profile' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  My Profile
                </Link>
              )}
              <div className="border-t border-gray-100 pt-3">
                {user ? (
                  <button
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    Logout
                  </button>
                ) : (
                  <Link href="/login" role="menuitem" onClick={() => setMenuOpen(false)} className="block rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-white">
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
