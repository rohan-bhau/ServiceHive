'use client';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function ManageServicesPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
        <Link href="/services/add">
          <Button>Add New Service</Button>
        </Link>
      </div>
      <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
        <p className="text-lg text-gray-600">You haven&apos;t listed any services yet.</p>
        <Link href="/services/add">
          <Button className="mt-4">List Your First Service</Button>
        </Link>
      </div>
    </main>
  );
}
