'use client';
import { useState } from 'react';
import { showToast } from '@/lib/utils';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      showToast.success('Subscribed!');
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md gap-3">
      <div className="relative flex-1">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full rounded-full border border-gray-700 bg-white/10 px-5 py-3.5 text-white placeholder:text-gray-400 backdrop-blur transition-all focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/20"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-gray-900 shadow-lg transition-all hover:bg-gray-100 active:scale-[0.98]"
      >
        Subscribe
      </button>
    </form>
  );
}
