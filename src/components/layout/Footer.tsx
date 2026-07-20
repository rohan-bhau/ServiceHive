import Link from 'next/link';
import {
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const FOOTER_LINKS = [
  {
    title: 'About',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Browse Services', href: '/explore' },
      { label: 'Tutoring', href: '/explore?category=Tutoring' },
      { label: 'Home Repair', href: '/explore?category=Home+Repair' },
      { label: 'Design', href: '/explore?category=Design+%26+Creative' },
    ],
  },
  {
    title: 'Categories',
    links: [
      { label: 'Fitness', href: '/explore?category=Fitness+%26+Health' },
      { label: 'Events', href: '/explore?category=Events+%26+Photography' },
      { label: 'Cleaning', href: '/explore?category=Cleaning' },
      { label: 'Tech Support', href: '/explore?category=Tech+Support' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/contact' },
      { label: 'Safety', href: '/privacy' },
      { label: 'Report an Issue', href: '/contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
              Service<span className="text-primary">Hive</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              AI-powered marketplace connecting you with trusted local service providers.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <EnvelopeIcon className="h-4 w-4 flex-shrink-0" />
                <span>hello@servicehive.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-gray-900">{group.title}</h3>
              <ul className="mt-4 space-y-3" aria-label={`${group.title} links`}>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-gray-500 transition-colors hover:text-gray-900">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 border-t border-gray-200 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} ServiceHive. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
