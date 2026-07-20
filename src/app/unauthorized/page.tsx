import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl">🔒</div>
        <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-500">
          You don't have permission to access this page. Please contact an administrator if you believe this is a mistake.
        </p>
        <Link href="/">
          <Button>Go to Home</Button>
        </Link>
      </div>
    </main>
  );
}
