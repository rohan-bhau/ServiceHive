'use client';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { showToast, formatDate } from '@/lib/utils';
import { useGetUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation } from '@/store/api/adminApi';
import { useState } from 'react';

const roleOptions = [
  { value: 'customer', label: 'Customer' },
  { value: 'provider', label: 'Provider' },
  { value: 'admin', label: 'Admin' },
];

export default function AdminUsersPage() {
  const { data: usersData, isLoading, error } = useGetUsersQuery(undefined);
  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();

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

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-display">Users</h1>
        <p className="mt-2 text-gray-500">Manage all platform users and their roles.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} height="60px" className="rounded-xl" />)}
        </div>
      ) : error ? (
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
    </main>
  );
}
