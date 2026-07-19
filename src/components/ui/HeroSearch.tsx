'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function HeroSearch() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/explore?search=${encodeURIComponent(search)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-xl">
      <div className="group relative">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="What service do you need?"
          className="w-full rounded-full border border-gray-200 bg-white/80 px-5 py-4 pl-14 text-base text-gray-900 shadow-sm backdrop-blur transition-all placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
        />
      </div>
    </form>
  );
}
