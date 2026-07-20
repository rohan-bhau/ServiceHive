'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { showToast, formatDate } from '@/lib/utils';
import { useGetAdminStatsQuery, useGetUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation, useGetPendingServicesQuery, useApproveServiceMutation, useDeleteServiceMutation } from '@/store/api/adminApi';
import {
  UsersIcon,
  BriefcaseIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line,
} from 'recharts';

const statCards = [
  { key: 'totalCustomers', label: 'Total Customers', icon: UserGroupIcon, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { key: 'totalProviders', label: 'Total Providers', icon: BriefcaseIcon, color: 'bg-green-50 text-green-600 border-green-100' },
  { key: 'totalServices', label: 'Total Services', icon: BuildingStorefrontIcon, color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { key: 'totalBookings', label: 'Total Bookings', icon: ClipboardDocumentCheckIcon, color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { key: 'pendingServices', label: 'Pending Approvals', icon: ClockIcon, color: 'bg-red-50 text-red-600 border-red-100' },
];

const CHART_COLORS = ['#3b82f6', '#22c55e', '#a855f7', '#f59e0b', '#ef4444'];

const PIE_COLORS = ['#22c55e', '#ef4444'];

const roleOptions = [
  { value: 'customer', label: 'Customer' },
  { value: 'provider', label: 'Provider' },
  { value: 'admin', label: 'Admin' },
];

export default function AdminDashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get('tab') || 'overview';

  const { data: stats, isLoading: statsLoading, error: statsError } = useGetAdminStatsQuery(undefined);
  const { data: usersData, isLoading: usersLoading, error: usersError } = useGetUsersQuery(undefined, { skip: currentTab !== 'users' });
  const { data: pendingData, isLoading: pendingLoading, error: pendingError } = useGetPendingServicesQuery(undefined, { skip: currentTab !== 'services' });

  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();
  const [approveService, { isLoading: isApproving }] = useApproveServiceMutation();
  const [deleteService, { isLoading: isDeletingService }] = useDeleteServiceMutation();

  const setTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === 'overview') params.delete('tab');
    else params.set('tab', tab);
    router.push(`/admin/dashboard?${params.toString()}`);
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await updateUserRole({ id: userId, role }).unwrap();
      showToast.success('User role updated');
    } catch (err: any) {
      showToast.error(err?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(userId).unwrap();
      showToast.success('User deleted');
    } catch (err: any) {
      showToast.error(err?.data?.message || 'Failed to delete user');
    }
  };

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

  const barData = stats
    ? [
        { name: 'Customers', count: stats.totalCustomers },
        { name: 'Providers', count: stats.totalProviders },
        { name: 'Services', count: stats.totalServices },
        { name: 'Bookings', count: stats.totalBookings },
      ]
    : [];

  const pieData = stats
    ? [
        { name: 'Approved', value: stats.totalServices - stats.pendingServices },
        { name: 'Pending', value: stats.pendingServices },
      ]
    : [];

  const lineData = stats
    ? [
        { name: 'Customers', count: stats.totalCustomers },
        { name: 'Providers', count: stats.totalProviders },
        { name: 'Services', count: stats.totalServices },
        { name: 'Bookings', count: stats.totalBookings },
        { name: 'Pending', count: stats.pendingServices },
      ]
    : [];

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'users', label: 'Users' },
    { key: 'services', label: 'Services' },
  ];

  if (statsLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <Skeleton width="280px" height="36px" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} height="120px" className="rounded-2xl" />)}
        </div>
      </main>
    );
  }

  if (statsError) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState message="Could not load admin dashboard stats." onRetry={() => window.location.reload()} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-display">Platform Overview</h1>
        <p className="mt-2 text-gray-500">Super admin dashboard for managing the platform.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map(({ key, label, icon: Icon, color }) => (
          <Card key={key} className="flex items-center gap-4 p-6 shadow-sm border border-gray-100">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{(stats as any)?.[key] ?? 0}</h3>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTab(tab.key)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              currentTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {currentTab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Role</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Approval Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2">
              {pieData.map((entry, idx) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }} />
                  <span className="text-gray-600">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6 border border-gray-100 shadow-sm lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Metrics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {currentTab === 'users' && (
        <>
          {usersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} height="60px" className="rounded-xl" />)}
            </div>
          ) : usersError ? (
            <ErrorState message="Could not load users." onRetry={() => window.location.reload()} />
          ) : !usersData?.users?.length ? (
            <Card className="p-8 text-center border border-dashed border-gray-200">
              <p className="text-gray-500 text-sm">No users found.</p>
            </Card>
          ) : (
            <Card padding="none" className="overflow-hidden border border-gray-100 shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                  <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
                    {usersData.users.map((user: any) => (
                      <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 text-gray-500">{user.email}</td>
                        <td className="px-6 py-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            disabled={isUpdatingRole}
                            className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            {roleOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{formatDate(user.createdAt)}</td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={isDeletingUser}
                            className="text-xs border-red-200 text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Services Tab */}
      {currentTab === 'services' && (
        <>
          {pendingLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} height="60px" className="rounded-xl" />)}
            </div>
          ) : pendingError ? (
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
        </>
      )}
    </main>
  );
}
