'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useRegisterMutation } from '@/store/api/authApi';
import { showToast, cn } from '@/lib/utils';
import GoogleSignInButton from '@/components/ui/GoogleSignInButton';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-orange-500' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-yellow-500' };
  if (score <= 4) return { score, label: 'Strong', color: 'bg-lime-500' };
  return { score, label: 'Very Strong', color: 'bg-green-500' };
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const [register, { isLoading }] = useRegisterMutation();

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const isValid = acceptedTerms && password === confirmPassword && password.length >= 6 && name.trim() && email.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast.error('Passwords do not match');
      return;
    }
    if (!acceptedTerms) {
      showToast.error('You must accept the terms and conditions');
      return;
    }
    try {
      await register({ name, email, password, role }).unwrap();
      showToast.success('Account created!');
      router.push('/dashboard');
    } catch (err: any) {
      const message = err?.data?.message || 'Registration failed';
      showToast.error(message);
      if (err?.data?.isExistingUser) {
        setTimeout(() => router.push('/login'), 1500);
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-gray-600">Join ServiceHive today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-8 shadow-sm">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          <div>
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required />
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-1.5 flex-1 rounded-full transition-colors duration-200',
                        i <= strength.score ? strength.color : 'bg-gray-200'
                      )}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs" style={{ color: strength.score <= 2 ? '#ef4444' : strength.score <= 3 ? '#eab308' : '#22c55e' }}>
                  {strength.label}
                </p>
              </div>
            )}
          </div>
          <Input label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat your password" required />
          {confirmPassword.length > 0 && password !== confirmPassword && (
            <p className="-mt-4 text-sm text-red-500">Passwords do not match</p>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">I want to join as</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'customer' | 'provider')}
              className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="customer">Customer — I want to hire services</option>
              <option value="provider">Provider — I want to offer services</option>
            </select>
          </div>
          <div className="flex items-start gap-2">
            <input
              id="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I accept the{' '}
              <Link href="/terms" target="_blank" className="text-primary hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" target="_blank" className="text-primary hover:underline">Privacy Policy</Link>
            </label>
          </div>
          <Button type="submit" disabled={!isValid} loading={isLoading} className="w-full">Create Account</Button>
          <div className="relative" role="separator" aria-label="or sign up with">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">or sign up with</span></div>
          </div>
          <GoogleSignInButton />
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
