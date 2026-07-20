'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ServiceCard from '@/components/services/ServiceCard';
import { useAuth } from '@/lib/auth';
import { showToast, formatPrice } from '@/lib/utils';
import { useGetBookingsQuery, useUpdateBookingStatusMutation } from '@/store/api/bookingsApi';
import { useGetRecommendationsQuery } from '@/store/api/aiApi';
import {
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton width="200px" height="36px" />
      </main>
    );
  }

  if (user?.role === 'admin') {
    return <AdminRedirect />;
  }

  if (user?.role === 'provider') {
    return <ProviderDashboard />;
  }

  return <CustomerDashboard />;
}

function AdminRedirect() {
  const router = useRouter();
  useEffect(() => { router.push('/admin/dashboard'); }, [router]);
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton width="200px" height="36px" />
    </main>
  );
}

function ProviderDashboard() {
  const { user } = useAuth();
  const { data: bookingsData, isLoading, error } = useGetBookingsQuery(undefined);
  const [updateBookingStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

  const myBookings = (bookingsData?.bookings || []).filter(
    (bk: any) => bk.providerId?._id === user?.userId || bk.providerId === user?.userId
  );

  const totalBookings = myBookings.length;
  const pendingRequests = myBookings.filter((bk: any) => bk.status === 'pending').length;
  const confirmedCount = myBookings.filter((bk: any) => bk.status === 'confirmed' || bk.status === 'completed').length;

  const handleUpdateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      await updateBookingStatus({ id, status }).unwrap();
      showToast.success(`Booking ${status}`);
    } catch (err: any) {
      showToast.error(err?.data?.message || 'Failed to update booking status');
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <Skeleton width="200px" height="36px" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} height="100px" className="rounded-2xl" />)}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState message="Could not load your dashboard." onRetry={() => window.location.reload()} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-display">Provider Dashboard</h1>
        <p className="mt-2 text-gray-500">Manage your bookings and services.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="flex items-center gap-4 p-6 shadow-sm border border-gray-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ClipboardDocumentCheckIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Bookings</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{totalBookings}</h3>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-6 shadow-sm border border-gray-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-600 border border-yellow-100">
            <ClockIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Requests</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{pendingRequests}</h3>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-6 shadow-sm border border-gray-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600 border border-green-100">
            <CheckIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Services</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{confirmedCount}</h3>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 font-display">Booking Requests</h2>
        {myBookings.length === 0 ? (
          <Card className="p-8 text-center border border-dashed border-gray-200">
            <p className="text-gray-500 text-sm">No booking requests yet.</p>
          </Card>
        ) : (
          <Card padding="none" className="overflow-hidden border border-gray-100 shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
                  {myBookings.map((bk: any) => {
                    const customer = bk.customerId || {};
                    const svc = bk.serviceId || {};
                    return (
                      <tr key={bk._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{customer.name || 'Unknown'}</td>
                        <td className="px-6 py-4 text-gray-500">{svc.title || 'Service'}</td>
                        <td className="px-6 py-4 text-gray-500">{new Date(bk.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                            bk.status === 'completed'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : bk.status === 'confirmed'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : bk.status === 'cancelled'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                            {bk.status.charAt(0).toUpperCase() + bk.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {bk.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleUpdateStatus(bk._id, 'confirmed')}
                                disabled={isUpdating}
                                className="text-xs"
                              >
                                <CheckIcon className="h-3.5 w-3.5 mr-1" />
                                Accept
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateStatus(bk._id, 'cancelled')}
                                disabled={isUpdating}
                                className="text-xs border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <XMarkIcon className="h-3.5 w-3.5 mr-1" />
                                Cancel
                              </Button>
                            </div>
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
    </main>
  );
}

function CustomerDashboard() {
  const { user } = useAuth();
  const { data: bookingsData, isLoading: isBookingsLoading, error: bookingsError } = useGetBookingsQuery(undefined);
  const { data: recommendationsData, isLoading: isRecsLoading, error: recsError } = useGetRecommendationsQuery(undefined);
  const [updateBookingStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

  const myBookings = (bookingsData?.bookings || []).filter(
    (bk: any) => bk.customerId?._id === user?.userId || bk.customerId === user?.userId
  );
  const recommendedList = recommendationsData?.recommendations || [];

  const handleCancel = async (id: string) => {
    try {
      await updateBookingStatus({ id, status: 'cancelled' }).unwrap();
      showToast.success('Booking cancelled');
    } catch (err: any) {
      showToast.error(err?.data?.message || 'Failed to cancel booking');
    }
  };

  if (isBookingsLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <Skeleton width="200px" height="36px" />
        <Skeleton height="200px" className="rounded-2xl" />
      </main>
    );
  }

  if (bookingsError && recsError) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState message="Could not load your dashboard." onRetry={() => window.location.reload()} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-display">My Dashboard</h1>
        <p className="mt-2 text-gray-500">Review your bookings and recommendations.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 font-display">Booking History</h2>
        {myBookings.length === 0 ? (
          <Card className="p-8 text-center border border-dashed border-gray-200">
            <p className="text-gray-500 text-sm">You haven&apos;t made any bookings yet.</p>
            <Link href="/explore" className="mt-4 inline-block">
              <Button>Explore Services</Button>
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
                            {svc.title || 'Service'}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{provider.name || 'Unknown'}</td>
                        <td className="px-6 py-4 text-gray-500">{new Date(bk.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                            bk.status === 'completed'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : bk.status === 'confirmed'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : bk.status === 'cancelled'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                            {bk.status.charAt(0).toUpperCase() + bk.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {bk.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancel(bk._id)}
                              disabled={isUpdating}
                              className="text-xs border-red-200 text-red-600 hover:bg-red-50"
                            >
                              Cancel
                            </Button>
                          )}
                          {bk.status !== 'pending' && bk.status !== 'cancelled' && (
                            <span className="text-xs text-gray-400">Cannot cancel</span>
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

      {/* AI Recommendations */}
      {!isRecsLoading && recommendedList.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-6 w-6 text-secondary animate-pulse" />
            <h2 className="text-xl font-bold text-gray-900 font-display">Recommended For You</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {recommendedList.map((rec: any) => {
              const serviceObj = rec.serviceId;
              if (!serviceObj) return null;
              return (
                <div key={rec._id} className="relative group">
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
        </div>
      )}
    </main>
  );
}
