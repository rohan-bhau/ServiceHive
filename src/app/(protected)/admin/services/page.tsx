'use client';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { showToast, formatDate } from '@/lib/utils';
import { useGetPendingServicesQuery, useApproveServiceMutation, useDeleteServiceMutation } from '@/store/api/adminApi';

export default function AdminServicesPage() {
  const { data: pendingData, isLoading, error } = useGetPendingServicesQuery(undefined);
  const [approveService, { isLoading: isApproving }] = useApproveServiceMutation();
  const [deleteService, { isLoading: isDeletingService }] = useDeleteServiceMutation();

  const handleApproveService = async (serviceId: string) => {
    try {
      await approveService(serviceId).unwrap();
      showToast.success('Service approved');
    } catch (err: any) {
      showToast.error(err?.data?.message || 'Failed to approve service');
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteService(serviceId).unwrap();
      showToast.success('Service deleted');
    } catch (err: any) {
      showToast.error(err?.data?.message || 'Failed to delete service');
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-display">Pending Services</h1>
        <p className="mt-2 text-gray-500">Review and approve service listings from providers.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} height="60px" className="rounded-xl" />)}
        </div>
      ) : error ? (
        <ErrorState message="Could not load pending services." onRetry={() => window.location.reload()} />
      ) : !pendingData?.services?.length ? (
        <Card className="p-8 text-center border border-dashed border-gray-200">
          <p className="text-gray-500 text-sm">No pending services. All services have been reviewed.</p>
        </Card>
      ) : (
        <Card padding="none" className="overflow-hidden border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Provider</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
                {pendingData.services.map((svc: any) => (
                  <tr key={svc._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{svc.title}</td>
                    <td className="px-6 py-4 text-gray-500">{svc.providerId?.name || 'Unknown'}</td>
                    <td className="px-6 py-4">
                      <Badge variant="info">{svc.category}</Badge>
                    </td>
                    <td className="px-6 py-4 font-medium">${svc.price}</td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(svc.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveService(svc._id)}
                          disabled={isApproving}
                          className="text-xs"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteService(svc._id)}
                          disabled={isDeletingService}
                          className="text-xs border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </main>
  );
}
