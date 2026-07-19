'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useLoginMutation, useDemoLoginMutation } from '@/store/api/authApi';
import { showToast } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const [demoLogin, { isLoading: isDemoLoading }] = useDemoLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password }).unwrap();
      showToast.success('Welcome back!');
      router.push('/dashboard');
    } catch {
      showToast.error('Invalid email or password');
    }
  };

  const handleDemoLogin = async () => {
    try {
      await demoLogin(undefined).unwrap();
      showToast.success('Logged in as demo user');
      router.push('/dashboard');
    } catch {
      showToast.error('Demo login failed');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-gray-600">Sign in to your ServiceHive account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-8 shadow-sm">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          <Button type="submit" loading={isLoading} className="w-full">Sign In</Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">or</span></div>
          </div>
          <Button type="button" variant="ghost" loading={isDemoLoading} onClick={handleDemoLogin} className="w-full">
            Demo Login (One Click)
          </Button>
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
