'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { showToast } from '@/lib/utils';
import { useGetBookingsQuery, useUpdateBookingStatusMutation } from '@/store/api/bookingsApi';
import { useGetRecommendationsQuery } from '@/store/api/aiApi';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ServiceCard from '@/components/services/ServiceCard';
import { SparklesIcon } from '@heroicons/react/24/outline';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const { data: bookingsData, isLoading: isBookingsLoading, error: bookingsError } = useGetBookingsQuery(undefined);
  const { data: recommendationsData, isLoading: isRecsLoading, error: recsError } = useGetRecommendationsQuery(undefined);
  const [updateBookingStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

  const myBookings = (bookingsData?.bookings || []).filter(
    (bk: any) => bk.customerId?._id === user?._id || bk.customerId === user?._id
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
