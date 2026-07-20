import { requireRole } from '@/lib/session';

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  await requireRole('customer');
  return <>{children}</>;
}
