'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { showToast } from '@/lib/utils';
import ContentGeneratorModal from '@/components/ai/ContentGeneratorModal';
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useGetServiceByIdQuery,
} from '@/store/api/servicesApi';
import { SparklesIcon } from '@heroicons/react/24/outline';

const CATEGORIES = [
  'Home Repair',
  'Tutoring',
  'Design & Creative',
  'Fitness & Health',
  'Cleaning',
];

function AddServiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('id');

  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    price: '',
    priceUnit: 'fixed',
    location: '',
    city: '',
    tags: '',
    availability: '',
  });

  // Queries & Mutations
  const { data: serviceData, isLoading: isFetchingService } = useGetServiceByIdQuery(serviceId!, {
    skip: !serviceId,
  });

  const [createService] = useCreateServiceMutation();
  const [updateService] = useUpdateServiceMutation();

  // Pre-fill form if editing an existing service
  useEffect(() => {
    if (serviceData?.service) {
      const s = serviceData.service;
      setForm({
        title: s.title || '',
        shortDescription: s.shortDescription || '',
        fullDescription: s.fullDescription || '',
        category: s.category || '',
        price: s.price ? s.price.toString() : '',
        priceUnit: s.priceUnit || 'fixed',
        location: s.location || '',
        city: s.city || '',
        tags: s.tags ? s.tags.join(', ') : '',
        availability: s.availability || '',
      });
    }
  }, [serviceData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUseAiDraft = (shortDescription: string, fullDescription: string) => {
    setForm((prev) => ({
      ...prev,
      shortDescription,
      fullDescription,
    }));
    showToast.success('AI description draft applied!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const tagsArray = form.tags
      ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      title: form.title,
      shortDescription: form.shortDescription,
      fullDescription: form.fullDescription,
      category: form.category,
      price: parseFloat(form.price),
      priceUnit: form.priceUnit as 'fixed' | 'per_hour',
      location: form.location,
      city: form.city,
      tags: tagsArray,
      availability: form.availability,
    };

    try {
      if (serviceId) {
        // Edit service listing
        await updateService({ id: serviceId, ...payload }).unwrap();
        showToast.success('Service updated successfully!');
      } else {
        // Create service listing
        await createService(payload).unwrap();
        showToast.success('Service listed successfully!');
      }
      router.push('/services/manage');
    } catch (err: any) {
      showToast.error(err?.data?.message || 'Failed to submit service');
    } finally {
      setLoading(false);
    }
  };

  if (serviceId && isFetchingService) {
    return (
      <main className="mx-auto max-w-3xl py-12 px-6">
        <Skeleton height="32px" width="180px" />
        <Skeleton height="500px" className="mt-8 rounded-2xl" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 font-display">
          {serviceId ? 'Edit Your Service' : 'List a Service'}
        </h1>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsGeneratorOpen(true)}
          className="flex items-center gap-2 border-primary/20 hover:bg-primary/5 text-primary"
        >
          <SparklesIcon className="h-5 w-5" />
          Generate Descriptions with AI
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
        <Input
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Professional Math Tutoring"
          required
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Short Description</label>
          <textarea
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            rows={2}
            className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Brief summary shown on category cards (max 100 words)"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Full Description</label>
          <textarea
            name="fullDescription"
            value={form.fullDescription}
            onChange={handleChange}
            rows={5}
            className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Detailed details, includes, expectations, background..."
            required
          />
        </div>

        <Select
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          placeholder="Select a category"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price ($)"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
          <Select
            label="Price Unit"
            name="priceUnit"
            value={form.priceUnit}
            onChange={handleChange}
            options={[
              { value: 'fixed', label: 'Fixed Price' },
              { value: 'per_hour', label: 'Per Hour' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Online, Client's Home"
          />
          <Input
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="e.g. San Francisco"
          />
        </div>

        <Input
          label="Tags (comma-separated)"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="math, algebra, high-school"
        />

        <Input
          label="Availability"
          name="availability"
          value={form.availability}
          onChange={handleChange}
          placeholder="e.g. Weekdays 9AM-5PM, Saturdays 10AM-2PM"
        />

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="w-1/3 h-12"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="w-2/3 h-12"
          >
            {serviceId ? 'Update Service' : 'List Service'}
          </Button>
        </div>
      </form>

      {/* AI Listing Content Generator Modal */}
      <ContentGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onUse={handleUseAiDraft}
      />
    </main>
  );
}

export default function AddServicePage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-3xl py-12 px-6 text-center text-sm text-gray-500">
        Loading service listing form...
      </div>
    }>
      <AddServiceForm />
    </Suspense>
  );
}
