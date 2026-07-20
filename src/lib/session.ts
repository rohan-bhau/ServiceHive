import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface UserSession {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'provider' | 'admin';
  avatarUrl?: string;
}

export const getUserSession = cache(async (): Promise<UserSession | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  if (!token) return null;

  // Build the full cookie header string to forward to the backend
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/auth/me`, {
      headers: {
        Cookie: cookieString,
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch (err) {
    console.error('Error fetching user session:', err);
    return null;
  }
});

export const requireRole = async (role: 'customer' | 'provider' | 'admin') => {
  const user = await getUserSession();
  if (!user || user.role !== role) {
    redirect('/unauthorized');
  }
  return user;
};

export const requireAuth = async () => {
  const user = await getUserSession();
  if (!user) {
    redirect('/login');
  }
  return user;
};
