'use client';
import { useState, useEffect, useRef } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import ServiceCard from '@/components/services/ServiceCard';
import { useGetServicesQuery } from '@/store/api/servicesApi';
import type { Service } from '@/types';

const CATEGORIES = [
  'All',
  'Home Repair',
  'Tutoring',
  'Design & Creative',
  'Fitness & Health',
  'Cleaning',
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [page, setPage] = useState(1);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomBoundaryRef = useRef<HTMLDivElement | null>(null);

  // Debounce search text input by 500ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset page parameter back to 1 if search, category, or other filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, sort, city, minPrice, maxPrice, minRating]);

  const { data, isLoading, isFetching, error } = useGetServicesQuery({
    search: debouncedSearch,
    category,
    sort,
    city,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    minRating: minRating ? parseFloat(minRating) : undefined,
    page,
  });

  const services: Service[] = data?.services || [];
  const hasMore = data ? page < data.totalPages : false;

  // Infinite Scroll Observer
  useEffect(() => {
    if (isLoading || isFetching) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    if (bottomBoundaryRef.current) {
      observerRef.current.observe(bottomBoundaryRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [isLoading, isFetching, hasMore]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setSort('newest');
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setPage(1);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Explore Services</h1>
          <p className="mt-2 text-gray-500">Discover and compare the best local services in your area.</p>
        </div>

        {/* Filters Panel */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search services (e.g. plumbing, algebra, design)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={CATEGORIES.map((c) => ({ value: c === 'All' ? '' : c, label: c }))}
                placeholder="All Categories"
              />
            </div>
            <div>
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                options={SORT_OPTIONS}
                placeholder="Sort By"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <Input
              placeholder="City (e.g. San Francisco)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="Min Price ($)"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="text-gray-400">—</span>
              <Input
                type="number"
                placeholder="Max Price ($)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <div>
              <Select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                options={[
                  { value: '4', label: '4.0+ Stars' },
                  { value: '4.5', label: '4.5+ Stars' },
                  { value: '5', label: '5.0 Stars' },
                ]}
                placeholder="Minimum Rating"
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="w-full h-11"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Results grid */}
        {isLoading && page === 1 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="p-4 overflow-hidden">
                <Skeleton height="160px" className="rounded-xl" />
                <div className="mt-4 space-y-2">
                  <Skeleton width="40%" height="16px" />
                  <Skeleton width="80%" height="24px" />
                  <Skeleton width="60%" height="16px" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <ErrorState
            message="We couldn't load services right now. Please check your connection and try again."
            onRetry={() => window.location.reload()}
          />
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No services found</h3>
            <p className="mt-2 text-sm text-gray-500">We couldn&apos;t find any services matching your criteria.</p>
            <Button onClick={handleResetFilters} className="mt-6">
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>

            {/* Load more spinner boundary */}
            {hasMore && (
              <div ref={bottomBoundaryRef} className="py-8 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            )}
            {!hasMore && services.length > 0 && (
              <p className="text-center text-sm text-gray-400 py-6">
                You&apos;ve reached the end of the results.
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
