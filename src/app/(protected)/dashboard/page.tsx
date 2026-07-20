import { redirect } from 'next/navigation';
import { getUserSession } from '@/lib/session';

export default async function DashboardPage() {
  const user = await getUserSession();
  if (!user) {
    redirect('/login');
  }
  if (user.role === 'admin') {
    redirect('/admin/dashboard');
  }
  if (user.role === 'provider') {
    redirect('/provider/dashboard');
  }
  redirect('/customer/dashboard');
}
