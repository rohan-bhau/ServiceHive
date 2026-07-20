'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ServiceCard from '@/components/services/ServiceCard';
import { useAuth } from '@/lib/auth';
import { showToast, formatPrice } from '@/lib/utils';
import { useGetBookingsQuery, useGetBookingStatsQuery, useUpdateBookingStatusMutation } from '@/store/api/bookingsApi';
import { useGetRecommendationsQuery } from '@/store/api/aiApi';

// Recharts Widgets
import BookingsLineChart from '@/components/dashboard/BookingsLineChart';
import RevenueBarChart from '@/components/dashboard/RevenueBarChart';
import RatingAreaChart from '@/components/dashboard/RatingAreaChart';
import StatusPieChart from '@/components/dashboard/StatusPieChart';

import {
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
  SparklesIcon,
  CheckIcon,
  XMarkIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { user, isLoading: isAuthLoading } = useAuth();
  const isProvider = user?.role === 'provider';

  // Customer Queries
  const { data: bookingsData, isLoading: isBookingsLoading } = useGetBookingsQuery(undefined, {
    skip: isProvider || !user,
  });
  const { data: recommendationsData, isLoading: isRecsLoading } = useGetRecommendationsQuery(undefined, {
    skip: isProvider || !user,
  });

  // Provider Queries
  const { data: statsData, isLoading: isStatsLoading } = useGetBookingStatsQuery(undefined, {
    skip: !isProvider || !user,
  });

  // Mutations
  const [updateBookingStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

  const handleUpdateStatus = async (id: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    try {
      await updateBookingStatus({ id, status }).unwrap();
      showToast.success(`Booking status updated to ${status}`);
    } catch (err: any) {
      showToast.error(err?.data?.message || 'Failed to update booking status');
    }
  };

  const skeleton = (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <Skeleton width="200px" height="36px" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} height="120px" className="rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton height="300px" className="rounded-2xl" />
        <Skeleton height="300px" className="rounded-2xl" />
      </div>
    </main>
  );

  if (!mounted) return skeleton;

  if (isAuthLoading || (isProvider ? isStatsLoading : (isBookingsLoading || isRecsLoading))) {
    return skeleton;
  }

  // --- 1. PROVIDER VIEW PANEL ---
  if (isProvider) {
    const stats = statsData || { bookingsOverTime: [], revenueByCategory: [], ratingTrend: [], statusBreakdown: [] };
    
    // Aggregate core numbers
    const totalBookingsCount = stats.bookingsOverTime.reduce((acc: number, cur: any) => acc + cur.count, 0);
    const totalRevenueSum = stats.revenueByCategory.reduce((acc: number, cur: any) => acc + cur.total, 0);
    const avgRating = stats.ratingTrend.length > 0
      ? Math.round((stats.ratingTrend.reduce((acc: number, cur: any) => acc + cur.avg, 0) / stats.ratingTrend.length) * 10) / 10
      : 5.0;

    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Provider Dashboard</h1>
          <p className="mt-2 text-gray-500">Monitor your performance analytics, leads, and earnings.</p>
        </div>

        {/* Aggregate KPI Metric Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="flex items-center gap-4 p-6 shadow-sm border border-gray-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ClipboardDocumentCheckIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{totalBookingsCount}</h3>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-6 shadow-sm border border-gray-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600 border border-green-100">
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Earnings</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">${totalRevenueSum}</h3>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-6 shadow-sm border border-gray-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
              <StarIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Client Rating</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{avgRating} ★</h3>
            </div>
          </Card>
        </div>

        {/* 2x2 Recharts Charts Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BookingsLineChart data={stats.bookingsOverTime} />
          <RevenueBarChart data={stats.revenueByCategory} />
          <RatingAreaChart data={stats.ratingTrend} />
          <StatusPieChart data={stats.statusBreakdown} />
        </div>
      </main>
    );
  }

  // --- 2. CUSTOMER VIEW PANEL ---
  const myBookings = bookingsData?.bookings || [];
  const recommendedList = recommendationsData?.recommendations || [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-display">My Dashboard</h1>
        <p className="mt-2 text-gray-500">Review your requested reservations, messages, and AI recommendations.</p>
      </div>

      {/* Booking Reservations section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 font-display">My Bookings & Statuses</h2>
        {myBookings.length === 0 ? (
          <Card className="p-8 text-center border border-dashed border-gray-200">
            <p className="text-gray-500 text-sm">You haven&apos;t requested any bookings yet.</p>
            <Link href="/explore" className="mt-4 inline-block">
              <Button>Find and Book a Service</Button>
            </Link>
          </Card>
        ) : (
          <Card padding="none" className="overflow-hidden border border-gray-100 shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Provider</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
                  {myBookings.map((bk: any) => {
                    const svc = bk.serviceId || {};
                    const provider = bk.providerId || {};
                    return (
                      <tr key={bk._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <Link href={`/services/${svc._id}`} className="font-semibold text-gray-900 hover:text-primary">
                            {svc.title || 'Service Listing'}
                          </Link>
                          <div className="text-xs text-gray-400 mt-0.5">{svc.category}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{provider.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-medium">
                          {new Date(bk.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                              bk.status === 'completed'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : bk.status === 'confirmed'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : bk.status === 'cancelled'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}
                          >
                            {bk.status.charAt(0).toUpperCase() + bk.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {bk.status !== 'cancelled' && bk.status !== 'completed' && (
                            <Button
                              variant="outline"
                              onClick={() => handleUpdateStatus(bk._id, 'cancelled')}
                              className="text-xs border-red-200 text-red-600 hover:bg-red-50"
                              disabled={isUpdating}
                            >
                              Cancel Booking
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* AI Recommendations Feed Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-6 w-6 text-secondary animate-pulse" />
          <h2 className="text-xl font-bold text-gray-900 font-display">Recommended For You</h2>
        </div>
        {recommendedList.length === 0 ? (
          <Card className="p-8 text-center border border-dashed border-gray-200">
            <p className="text-gray-500 text-sm">We are still learning your preferences. Browse listings to get tailored matches!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {recommendedList.map((rec: any) => {
              const serviceObj = rec.serviceId;
              if (!serviceObj) return null;
              return (
                <div key={rec._id} className="relative group">
                  {/* Score badge at top right */}
                  <div className="absolute top-2 right-2 z-10 rounded-xl bg-secondary/90 px-2.5 py-1 text-xs font-bold text-white shadow-md backdrop-blur-sm">
                    {rec.score}% Match
                  </div>
                  <ServiceCard service={serviceObj} />
                  <div className="mt-2 px-2">
                    <p className="text-xs text-secondary font-medium leading-relaxed italic line-clamp-2">
                      &quot;{rec.reason}&quot;
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
