'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useUpdateProfileMutation } from '@/store/api/authApi';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import { showToast } from '@/lib/utils';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [form, setForm] = useState({ name: '', bio: '', location: '', phone: '', avatarUrl: '' });

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton height="200px" />
      </div>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <p className="text-gray-500">Unable to load profile.</p>
      </main>
    );
  }

  const startEditing = () => {
    setForm({
      name: user.name || '',
      bio: (user as any).bio || '',
      location: (user as any).location || '',
      phone: (user as any).phone || '',
      avatarUrl: user.avatarUrl || '',
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        name: form.name,
        bio: form.bio,
        location: form.location,
        phone: form.phone,
        avatarUrl: form.avatarUrl,
      }).unwrap();
      showToast.success('Profile updated');
      setIsEditing(false);
    } catch (err: any) {
      showToast.error(err?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <main className="mx-auto max-w-2xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={startEditing}>Edit Profile</Button>
        )}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-6">
          <Avatar name={user.name} src={user.avatarUrl} size="lg" />
          <div>
            <h2 className="text-xl font-semibold">{user.name || 'User'}</h2>
            <p className="text-gray-600">{user.email}</p>
            <span className="mt-1 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm capitalize text-primary">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Tell us about yourself"
          />
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="City, State"
          />
          <Input
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />
          <Input
            label="Avatar URL"
            value={form.avatarUrl || ''}
            onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
            placeholder="https://example.com/avatar.jpg"
          />
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} loading={isUpdating}>Save Changes</Button>
            <Button variant="ghost" onClick={cancelEditing}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
          <dl className="divide-y">
            <div className="flex justify-between py-3">
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="text-sm font-medium text-gray-900">{user.email}</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-sm text-gray-500">Bio</dt>
              <dd className="text-sm text-gray-900">{(user as any).bio || 'Not provided'}</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-sm text-gray-500">Location</dt>
              <dd className="text-sm text-gray-900">{(user as any).location || 'Not provided'}</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-sm text-gray-500">Phone</dt>
              <dd className="text-sm text-gray-900">{(user as any).phone || 'Not provided'}</dd>
            </div>
          </dl>
        </div>
      )}
    </main>
  );
}
