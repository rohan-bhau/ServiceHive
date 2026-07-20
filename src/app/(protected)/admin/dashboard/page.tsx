'use client';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import Card from '@/components/ui/Card';
import { useGetAdminStatsQuery } from '@/store/api/adminApi';
import {
  UsersIcon,
  BriefcaseIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line,
} from 'recharts';

const statCards = [
  { key: 'totalCustomers', label: 'Total Customers', icon: UsersIcon, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { key: 'totalProviders', label: 'Total Providers', icon: BriefcaseIcon, color: 'bg-green-50 text-green-600 border-green-100' },
  { key: 'totalServices', label: 'Total Services', icon: BuildingStorefrontIcon, color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { key: 'totalBookings', label: 'Total Bookings', icon: ClipboardDocumentCheckIcon, color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { key: 'pendingServices', label: 'Pending Approvals', icon: ClockIcon, color: 'bg-red-50 text-red-600 border-red-100' },
];

const PIE_COLORS = ['#22c55e', '#ef4444'];

export default function AdminDashboardPage() {
  const { data: stats, isLoading, error } = useGetAdminStatsQuery(undefined);

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

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <Skeleton width="280px" height="36px" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} height="120px" className="rounded-2xl" />)}
        </div>
      </main>
    );
  }

  if (error) {
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

      {/* Charts */}
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
    </main>
  );
}
