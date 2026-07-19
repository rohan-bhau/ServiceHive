'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { showToast } from '@/lib/utils';
import { EnvelopeIcon, MapPinIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/outline';

const CONTACT_INFO = [
  { icon: EnvelopeIcon, label: 'Email', value: 'hello@servicehive.com' },
  { icon: MapPinIcon, label: 'Office', value: 'San Francisco, CA 94105' },
  { icon: PhoneIcon, label: 'Phone', value: '+1 (555) 123-4567' },
  { icon: ClockIcon, label: 'Hours', value: 'Mon–Fri, 9AM – 6PM PST' },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    showToast.success('Message sent! We\'ll get back to you soon.');
    setSent(true);
    setLoading(false);
  };

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/[0.04] via-white to-secondary/[0.04] py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500">
            Have a question, feedback, or want to partner with us? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-1">
            {CONTACT_INFO.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{item.label}</p>
                    <p className="text-base font-semibold text-gray-900">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-2">
            {sent ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="mt-6 text-2xl font-bold text-gray-900">Message Sent!</h3>
                <p className="mt-2 text-gray-500">Thank you for reaching out. We&apos;ll respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
                  <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required />
                </div>
                <Input label="Subject" name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" required />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full rounded-xl border border-gray-300 p-4 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    placeholder="Tell us more about your inquiry..."
                    required
                  />
                </div>
                <Button type="submit" loading={loading} className="w-full sm:w-auto">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
