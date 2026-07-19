'use client';
import { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';

const CATEGORIES = [
  'All', 'Home Repair', 'Tutoring', 'Design & Creative', 'Fitness & Health',
  'Events & Photography', 'Cleaning', 'Tech Support', 'Consulting',
];

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Explore Services</h1>
        <Input
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-4">
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={CATEGORIES.map((c) => ({ value: c === 'All' ? '' : c, label: c }))}
            placeholder="Category"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton height="160px" />
            <Skeleton width="80%" height="20px" className="mt-3" />
            <Skeleton width="60%" height="16px" className="mt-2" />
          </Card>
        ))}
      </div>
    </main>
  );
}
