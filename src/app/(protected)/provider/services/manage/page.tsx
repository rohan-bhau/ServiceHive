'use client';
import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Rating from '@/components/ui/Rating';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/lib/auth';
import { showToast, formatPrice } from '@/lib/utils';
import type { Service } from '@/types';
import {
  useGetServicesQuery,
  useDeleteServiceMutation,
  useUpdateServiceMutation,
} from '@/store/api/servicesApi';
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

export default function ManageServicesPage() {
  const { user } = useAuth();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch only services matching this provider's ID
  const { data, isLoading, isFetching, error } = useGetServicesQuery(
    { providerId: user?._id || '' },
    { skip: !user?._id }
  );

  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();
  const [updateService] = useUpdateServiceMutation();

  const services: Service[] = data?.services || [];

  const handleToggleStatus = async (id: string, currentStatus: 'active' | 'paused') => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      await updateService({ id, status: newStatus }).unwrap();
      showToast.success(`Service status updated to ${newStatus}!`);
    } catch (err: any) {
      showToast.error(err?.data?.message || 'Failed to update service status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteService(deleteId).unwrap();
      showToast.success('Service deleted successfully!');
      setDeleteId(null);
    } catch (err: any) {
      showToast.error(err?.data?.message || 'Failed to delete service');
    }
  };

  if (isLoading || isFetching) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton width="180px" height="32px" />
          <Skeleton width="140px" height="40px" />
        </div>
        <Card className="p-6">
          <Skeleton height="300px" />
        </Card>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState
          message="Could not load your services. Please check your connection and try again."
          onRetry={() => window.location.reload()}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">My Listed Services</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your marketplace service profiles and edit listings.</p>
        </div>
        <Link href="/services/add">
          <Button className="flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Add New Service
          </Button>
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400">
            <PlusIcon className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No listed services</h3>
          <p className="mt-2 text-sm text-gray-500">You haven&apos;t listed any services in the ServiceHive marketplace yet.</p>
          <Link href="/services/add" className="mt-6 inline-block">
            <Button>List Your First Service</Button>
          </Link>
        </div>
      ) : (
        <Card padding="none" className="overflow-hidden border border-gray-100 shadow-sm">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
                {services.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden flex items-center justify-center">
                          {service.images?.[0] ? (
                            <img src={service.images[0]} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-sm font-bold text-gray-400">{service.category[0]}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 line-clamp-1">{service.title}</div>
                          <div className="text-xs text-gray-400">{service.city || 'Anywhere'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="default">{service.category}</Badge>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {formatPrice(service.price, service.priceUnit)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(service._id, service.status)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border cursor-pointer select-none transition-colors ${
                          service.status === 'active'
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${service.status === 'active' ? 'bg-green-600' : 'bg-yellow-500'}`} />
                        {service.status === 'active' ? 'Active' : 'Paused'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <Rating value={service.avgRating} count={service.reviewCount} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/services/${service._id}`} title="View Service">
                          <Button variant="ghost" className="p-2">
                            <EyeIcon className="h-5 w-5 text-gray-500 hover:text-primary" />
                          </Button>
                        </Link>
                        <Link href={`/services/add?id=${service._id}`} title="Edit Service">
                          <Button variant="ghost" className="p-2">
                            <PencilSquareIcon className="h-5 w-5 text-gray-500 hover:text-green-600" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="p-2"
                          onClick={() => setDeleteId(service._id)}
                          title="Delete Service"
                        >
                          <TrashIcon className="h-5 w-5 text-gray-500 hover:text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="block md:hidden divide-y divide-gray-100 bg-white">
            {services.map((service) => (
              <div key={service._id} className="p-4 space-y-3">
                <div className="flex gap-3">
                  <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden flex items-center justify-center">
                    {service.images?.[0] ? (
                      <img src={service.images[0]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-gray-400">{service.category[0]}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{service.title}</h4>
                    <p className="text-xs text-gray-400">{service.category} • {service.city}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-primary">{formatPrice(service.price, service.priceUnit)}</span>
                  <button
                    onClick={() => handleToggleStatus(service._id, service.status)}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border cursor-pointer transition-colors ${
                      service.status === 'active'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}
                  >
                    {service.status === 'active' ? 'Active' : 'Paused'}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <Rating value={service.avgRating} count={service.reviewCount} size="sm" />
                  <div className="flex gap-1">
                    <Link href={`/services/${service._id}`}>
                      <Button variant="ghost" className="p-1">
                        <EyeIcon className="h-4.5 w-4.5 text-gray-500" />
                      </Button>
                    </Link>
                    <Link href={`/services/add?id=${service._id}`}>
                      <Button variant="ghost" className="p-1">
                        <PencilSquareIcon className="h-4.5 w-4.5 text-gray-500" />
                      </Button>
                    </Link>
                    <Button variant="ghost" className="p-1" onClick={() => setDeleteId(service._id)}>
                      <TrashIcon className="h-4.5 w-4.5 text-gray-500 hover:text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete Service Listing?"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500 leading-relaxed">
            Are you sure you want to delete this service? This action is permanent and cannot be undone. All reviews associated with this listing will be kept, but the profile will be fully removed.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" loading={isDeleting} onClick={handleDeleteConfirm}>
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
