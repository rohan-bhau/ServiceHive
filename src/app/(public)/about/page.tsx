import Link from 'next/link';
import { ShieldCheckIcon, UserGroupIcon, LightBulbIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const VALUES = [
  {
    icon: ShieldCheckIcon,
    title: 'Trust & Safety',
    desc: 'Every provider is vetted, every transaction is secure, and your data is protected.',
  },
  {
    icon: UserGroupIcon,
    title: 'Community First',
    desc: 'We build tools that empower local providers and strengthen neighborhood economies.',
  },
  {
    icon: LightBulbIcon,
    title: 'Innovation',
    desc: 'AI-powered matching, smart recommendations, and tools that make service booking effortless.',
  },
  {
    icon: GlobeAltIcon,
    title: 'Accessibility',
    desc: 'Quality services should be available to everyone, everywhere, at any time.',
  },
];

const TEAM = [
  { name: 'Alex Chen', role: 'CEO & Co-Founder', bio: 'Former product lead at major marketplace platforms. Passionate about connecting communities.' },
  { name: 'Sarah Mitchell', role: 'CTO & Co-Founder', bio: 'AI researcher turned entrepreneur. Building the future of service discovery.' },
  { name: 'David Park', role: 'Head of Design', bio: 'Crafting intuitive experiences that make complex workflows feel simple and elegant.' },
];

export default function AboutPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/[0.04] via-white to-secondary/[0.04] py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            About <span className="text-primary">ServiceHive</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500">
            We&apos;re on a mission to connect people with the best local service providers — powered by AI.
            From tutoring to home repair, we make finding and booking trusted professionals effortless.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">Our Mission</h2>
            <p className="mt-4 text-4xl font-bold text-gray-900">Making local services work for everyone</p>
            <p className="mt-6 text-lg leading-relaxed text-gray-500">
              ServiceHive was founded to solve a simple problem: finding a trusted local service provider shouldn&apos;t be hard.
              We combine the power of AI with human expertise to match you with the right professional every time.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-gray-500">
              Whether you need a plumber, a math tutor, or a wedding photographer, our platform makes it easy to
              compare, book, and pay — all in one place.
            </p>
            <div className="mt-8">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
              >
                Explore Services
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/5 opacity-60 blur-2xl" />
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              alt="Team collaborating"
              className="relative rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">Our Values</h2>
            <p className="mt-3 text-4xl font-bold text-gray-900">What we stand for</p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="rounded-2xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-gray-900">{value.title}</h3>
                  <p className="mt-2 leading-relaxed text-gray-500">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">Team</h2>
          <p className="mt-3 text-4xl font-bold text-gray-900">Meet the founders</p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {TEAM.map((member) => (
            <div key={member.name} className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-white">
                {member.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">{member.name}</h3>
              <p className="text-sm font-medium text-primary">{member.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50/50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900">Ready to get started?</h2>
          <p className="mt-4 text-lg text-gray-500">Join thousands of users who trust ServiceHive for their local service needs.</p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90">
              Create Account
            </Link>
            <Link href="/explore" className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 transition-all hover:border-primary/30 hover:text-primary">
              Browse Services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
