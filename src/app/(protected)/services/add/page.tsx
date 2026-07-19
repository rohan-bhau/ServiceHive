'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { showToast } from '@/lib/utils';

const CATEGORIES = [
  'Home Repair', 'Tutoring', 'Design & Creative', 'Fitness & Health',
  'Events & Photography', 'Cleaning', 'Tech Support', 'Consulting',
];

export default function AddServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', shortDescription: '', fullDescription: '', category: '',
    price: '', priceUnit: 'fixed', location: '', city: '', tags: '', availability: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    showToast.success('Service listed successfully!');
    setLoading(false);
    router.push('/services/manage');
  };

  return (
    <main className="mx-auto max-w-3xl space-y-8 p-6">
      <h1 className="text-2xl font-bold text-gray-900">List a Service</h1>
      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-8 shadow-sm">
        <Input label="Title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Professional Math Tutoring" required />
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Short Description</label>
          <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows={3} className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Brief summary of your service" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Full Description</label>
          <textarea name="fullDescription" value={form.fullDescription} onChange={handleChange} rows={6} className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Detailed description of your service" required />
        </div>
        <Select label="Category" name="category" value={form.category} onChange={handleChange} options={CATEGORIES.map((c) => ({ value: c, label: c }))} placeholder="Select a category" required />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Price" name="price" type="number" value={form.price} onChange={handleChange} placeholder="0.00" required />
          <Select label="Price Unit" name="priceUnit" value={form.priceUnit} onChange={handleChange} options={[{ value: 'fixed', label: 'Fixed' }, { value: 'per_hour', label: 'Per Hour' }]} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Location" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Online, Client's Home" />
          <Input label="City" name="city" value={form.city} onChange={handleChange} placeholder="e.g. New York" />
        </div>
        <Input label="Tags (comma-separated)" name="tags" value={form.tags} onChange={handleChange} placeholder="math, algebra, high-school" />
        <Input label="Availability" name="availability" value={form.availability} onChange={handleChange} placeholder="e.g. Weekdays 9AM-5PM" />
        <Button type="submit" loading={loading} className="w-full">List Service</Button>
      </form>
    </main>
  );
}
