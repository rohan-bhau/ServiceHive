'use client';
import Link from 'next/link';
import AnimatedSection from '@/components/ui/AnimatedSection';
import HeroSearch from '@/components/ui/HeroSearch';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import NewsletterForm from '@/components/ui/NewsletterForm';
import ServiceCard from '@/components/services/ServiceCard';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';
import type { Service } from '@/types';
import { useGetPlatformStatsQuery, useGetServicesQuery, useGetTestimonialsQuery } from '@/store/api/servicesApi';
import { useGetRecommendationsQuery } from '@/store/api/aiApi';
import {
  WrenchScrewdriverIcon,
  AcademicCapIcon,
  PaintBrushIcon,
  HeartIcon,
  CameraIcon,
  SparklesIcon,
  ComputerDesktopIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const CATEGORIES = [
  { name: 'Home Repair', icon: WrenchScrewdriverIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
  { name: 'Tutoring', icon: AcademicCapIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: 'Design & Creative', icon: PaintBrushIcon, color: 'text-violet-600', bg: 'bg-violet-50' },
  { name: 'Fitness & Health', icon: HeartIcon, color: 'text-rose-600', bg: 'bg-rose-50' },
  { name: 'Events & Photography', icon: CameraIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { name: 'Cleaning', icon: SparklesIcon, color: 'text-sky-600', bg: 'bg-sky-50' },
  { name: 'Tech Support', icon: ComputerDesktopIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { name: 'Consulting', icon: BriefcaseIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
];

const STEPS = [
  { number: '01', title: 'Describe Your Need', desc: 'Tell us what service you\'re looking for in a few words.' },
  { number: '02', title: 'AI Matches You', desc: 'Our engine recommends the best providers for your specific needs.' },
  { number: '03', title: 'Book with Confidence', desc: 'Compare profiles, read reviews, and schedule securely.' },
  { number: '04', title: 'Share Feedback', desc: 'Leave a review and help the community make informed choices.' },
];

const FEATURES = [
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'AI Content Writer',
    desc: 'Write compelling service listings in seconds. Just drop a few bullet points and watch AI craft the perfect description.',
    link: '/services/add',
    gradient: 'from-primary/10 to-primary/5',
    iconColor: 'text-primary',
    borderColor: 'border-primary/10',
  },
  {
    icon: StarIcon,
    title: 'Smart Recommendations',
    desc: 'Get personalized provider matches based on your preferences, past bookings, and behavior patterns.',
    link: '/explore',
    gradient: 'from-secondary/10 to-secondary/5',
    iconColor: 'text-secondary',
    borderColor: 'border-secondary/10',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'AI Assistant',
    desc: 'Your 24/7 booking companion. Ask questions, get recommendations, and manage bookings through natural conversation.',
    link: '/ai/assistant',
    gradient: 'from-tertiary/10 to-tertiary/5',
    iconColor: 'text-tertiary',
    borderColor: 'border-tertiary/10',
  },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  // Queries
  const { data: statsData, error: statsError } = useGetPlatformStatsQuery(undefined);
  const { data: servicesData, isLoading: isServicesLoading, error: servicesError } = useGetServicesQuery({
    sort: 'rating',
    limit: 4,
    page: 1,
  });
  const { data: recommendationsData, error: recsError } = useGetRecommendationsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: testimonialsData, error: testimonialsError } = useGetTestimonialsQuery(undefined);

  const featuredServices: Service[] = servicesData?.services || [];
  const recommendations = recommendationsData?.recommendations || [];

  // Platform metrics computed or defaulted
  const statsMetrics = [
    { value: statsData?.providersCount || 5, suffix: '+', label: 'Providers Onboarded' },
    { value: statsData?.servicesCount || 13, suffix: '+', label: 'Active Listings' },
    { value: statsData?.averageRating || 4.9, suffix: '', label: 'Average rating' },
    { value: statsData?.bookingsCount || 12, suffix: '+', label: 'Bookings Completed' },
  ];

  return (
    <main>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/[0.04] via-white to-secondary/[0.04]">
        <div className="absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/4 -translate-y-1/4 rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/4 translate-y-1/4 rounded-full bg-secondary/[0.03] blur-3xl" />
        <div className="mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center gap-12 px-4 py-16 lg:flex-row lg:px-8">
          <div className="flex-1 text-center lg:text-left">
            <AnimatedSection direction="none">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <StarIcon className="h-4 w-4" />
                AI-Powered Service Matching
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.1} direction="none">
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-gray-900 sm:text-6xl lg:text-7xl font-display">
                Find the Perfect{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Local Service
                </span>
              </h1>
            </AnimatedSection>
            <AnimatedSection delay={0.2} direction="none">
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-500 lg:mx-0">
                Discover top-rated providers in your area. From tutoring to home repair, let AI match you with the right professional.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.3} direction="none" className="mt-8">
              <HeroSearch />
            </AnimatedSection>
            <AnimatedSection delay={0.4} direction="none" className="mt-6">
              <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                {CATEGORIES.slice(0, 4).map((cat) => (
                  <Link
                    key={cat.name}
                    href={`/explore?category=${encodeURIComponent(cat.name)}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/70 px-3.5 py-1.5 text-sm text-gray-600 shadow-sm backdrop-blur transition-all hover:border-primary/30 hover:text-primary hover:shadow-md"
                  >
                    {cat.name}
                  </Link>
                ))}
                <span className="inline-flex items-center px-3 py-1.5 text-sm text-gray-400">and more</span>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.5} direction="none" className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
              >
                Explore Services
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/services/add"
                className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 transition-all hover:border-primary/30 hover:text-primary active:scale-[0.98]"
              >
                List Your Service
              </Link>
            </AnimatedSection>
          </div>
          <AnimatedSection delay={0.3} direction="right" className="flex-1">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/5 opacity-60 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80"
                  alt="Professional service provider working with client"
                  className="h-full w-full object-cover"
                  style={{ maxHeight: '520px' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-xl border border-gray-100 bg-white/90 px-5 py-3 shadow-lg backdrop-blur">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex -space-x-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-7 w-7 rounded-full border-2 border-white bg-gradient-to-br from-primary/80 to-secondary/80" />
                    ))}
                  </div>
                  <span className="font-medium text-gray-700">ServiceHive Match</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="border-t border-gray-100 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">Categories</h2>
            <p className="mt-3 text-4xl font-bold text-gray-900 font-display">Browse by Category</p>
            <p className="mt-3 text-lg text-gray-500">Find exactly what you need across our specialized categories</p>
          </AnimatedSection>
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <AnimatedSection key={cat.name} delay={i * 0.05} direction="up">
                  <Link href={`/explore?category=${encodeURIComponent(cat.name)}`}>
                    <div className="group flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.bg} transition-transform group-hover:scale-110`}>
                        <Icon className={`h-6 w-6 ${cat.color}`} />
                      </div>
                      <span className="mt-3 text-center text-xs font-semibold text-gray-700 line-clamp-1">{cat.name}</span>
                    </div>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">Top Rated</h2>
            <p className="mt-3 text-4xl font-bold text-gray-900 font-display">Featured Services</p>
            <p className="mt-2 text-lg text-gray-500">Book highly-rated local professionals verified by our community.</p>
          </div>
          <Link href="/explore">
            <Button variant="outline" className="flex items-center gap-2">
              Browse All Services
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isServicesLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-4">
                <Skeleton height="160px" className="rounded-xl" />
                <Skeleton width="60%" height="16px" className="mt-4" />
                <Skeleton width="90%" height="24px" className="mt-2" />
                <Skeleton width="40%" height="16px" className="mt-2" />
              </Card>
            ))}
          </div>
        ) : servicesError ? (
          <ErrorState
            message="Could not load featured services right now."
            onRetry={() => window.location.reload()}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </section>

      {/* 4. RECOMMENDED FOR YOU (AUTHENTICATED ONLY) */}
      {isAuthenticated && recommendations.length > 0 && (
        <section className="bg-gradient-to-br from-secondary/[0.03] to-primary/[0.01] border-y border-gray-100 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-6 w-6 text-secondary animate-pulse" />
              <h2 className="text-3xl font-bold text-gray-900 font-display">Recommended For You</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recommendations.slice(0, 4).map((rec: any) => {
                const serviceObj = rec.serviceId;
                if (!serviceObj) return null;
                return (
                  <div key={rec._id} className="relative group">
                    <div className="absolute top-2 right-2 z-10 rounded-xl bg-secondary/95 px-2 py-0.5 text-xs font-bold text-white shadow-md">
                      {rec.score}% Match
                    </div>
                    <ServiceCard service={serviceObj} />
                    <p className="mt-2 px-2 text-xs text-secondary font-medium leading-relaxed italic line-clamp-2">
                      &quot;{rec.reason}&quot;
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 5. HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">How It Works</h2>
          <p className="mt-3 text-4xl font-bold text-gray-900 font-display">Four Simple Steps</p>
          <p className="mt-3 text-lg text-gray-500">From finding to booking — we make it effortless</p>
        </AnimatedSection>
        <div className="relative mt-16">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent lg:block" />
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <AnimatedSection key={step.number} delay={i * 0.1} direction="up">
                <div className="relative text-center lg:text-left">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-white shadow-lg shadow-primary/20 lg:mx-0">
                    {step.number}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-gray-500">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PLATFORM STATISTICS */}
      <section className="bg-primary py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {statsMetrics.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.1} direction="up">
                <div className="text-center text-white">
                  <div className="text-4xl font-bold tracking-tight sm:text-5xl">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="mt-2 text-sm font-medium text-white/70">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 7. AI HIGHLIGHT FEATURE HIGHLIGHT SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">AI Features</h2>
          <p className="mt-3 text-4xl font-bold text-gray-900 font-display">Powered by Intelligence</p>
          <p className="mt-3 text-lg text-gray-500">Three ways AI makes your experience better</p>
        </AnimatedSection>
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <AnimatedSection key={feature.title} delay={i * 0.1} direction="up" className="h-full">
                <Link href={feature.link} className="group block h-full">
                  <div className={`flex h-full flex-col rounded-2xl border ${feature.borderColor} bg-gradient-to-br ${feature.gradient} p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg`}>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ${feature.iconColor}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-gray-900">{feature.title}</h3>
                    <p className="mt-3 flex-1 leading-relaxed text-gray-500">{feature.desc}</p>
                    <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
                      Try it now
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* 8. TESTIMONIALS SECTION */}
      {testimonialsError ? (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400">Testimonials unavailable at this time.</p>
        </section>
      ) : testimonialsData?.testimonials && testimonialsData.testimonials.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">Testimonials</h2>
            <p className="mt-3 text-4xl font-bold text-gray-900 font-display">What Our Users Say</p>
            <p className="mt-3 text-lg text-gray-500">Hear from customers who found their perfect service match</p>
          </AnimatedSection>
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonialsData.testimonials.map((t: any, i: number) => (
              <AnimatedSection key={t._id} delay={i * 0.1} direction="up">
                <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`h-4 w-4 ${star <= t.rating ? 'fill-current' : 'fill-gray-200'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600 italic">&ldquo;{t.comment}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-sm font-bold text-primary">
                      {(t.userId?.name || 'U')[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.userId?.name || 'User'}</p>
                      <p className="text-xs text-gray-400">{t.serviceId?.title || 'Service'}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      {/* 9. NEWSLETTER SUBSCRIBE SECTION */}
      <section className="relative overflow-hidden bg-gray-900 py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-gray-900 to-secondary/10" />
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-white">Stay in the Loop</h2>
            <p className="mt-4 text-lg text-gray-300">
              Get notified about new services, exclusive offers, and AI feature updates.
            </p>
            <NewsletterForm />
            <p className="mt-4 text-xs text-gray-500">No spam. Unsubscribe anytime.</p>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
