import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="h-96 w-full max-w-md animate-pulse rounded-2xl bg-gray-100" />
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
