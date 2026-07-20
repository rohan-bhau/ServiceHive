'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Rating from '@/components/ui/Rating';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import ServiceCard from '@/components/services/ServiceCard';
import type { Service } from '@/types';
import { useAuth } from '@/lib/auth';
import { showToast, formatPrice } from '@/lib/utils';
import {
  useGetServiceByIdQuery,
  useGetRelatedServicesQuery,
  useTrackViewMutation,
  useTrackSaveMutation,
} from '@/store/api/servicesApi';
import { useGetReviewsQuery, useCreateReviewMutation } from '@/store/api/reviewsApi';
import { useCreateBookingMutation } from '@/store/api/bookingsApi';
import { useGetRecommendationsQuery } from '@/store/api/aiApi';
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  TagIcon,
  SparklesIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

export default function ServiceDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [bookingDate, setBookingDate] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [saved, setSaved] = useState(false);

  // Queries & Mutations
  const { data: serviceData, isLoading: isServiceLoading } = useGetServiceByIdQuery(id);
  const { data: relatedData } = useGetRelatedServicesQuery(id);
  const { data: reviewsData } = useGetReviewsQuery(id);
  const { data: recommendationsData } = useGetRecommendationsQuery(undefined, { skip: !isAuthenticated });

  const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();
  const [createReview, { isLoading: isReviewLoading }] = useCreateReviewMutation();
  const [trackView] = useTrackViewMutation();
  const [trackSave, { isLoading: isSaving }] = useTrackSaveMutation();

  const service = serviceData?.service;
  const relatedServices = relatedData?.services || [];
  const reviews = reviewsData?.reviews || [];

  // Track service view logs
  useEffect(() => {
    if (id && isAuthenticated) {
      trackView(id).unwrap().catch(() => {});
    }
  }, [id, isAuthenticated, trackView]);

  // Find if this service is in recommendations cache
  const match = recommendationsData?.recommendations?.find(
    (r: any) => {
      const matchId = typeof r.serviceId === 'object' ? r.serviceId._id : r.serviceId;
      return matchId === id;
    }
  );
  const matchScore = match?.score;
  const matchReason = match?.reason;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast.error('Please log in to book a service');
      router.push(`/login?redirect=/services/${id}`);
      return;
    }
    if (!bookingDate) {
      showToast.error('Please select a date');
      return;
    }

    try {
      await createBooking({
        serviceId: id,
        date: bookingDate,
        notes: bookingNotes,
      }).unwrap();
      showToast.success('Booking requested successfully!');
      setBookingDate('');
      setBookingNotes('');
      router.push('/dashboard');
    } catch (err: any) {
      showToast.error(err?.data?.message || 'Failed to request booking');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast.error('Please write a review comment');
      return;
    }

    try {
      await createReview({
        serviceId: id,
        rating: reviewRating,
        comment: reviewComment,
      }).unwrap();
      showToast.success('Review posted successfully!');
      setReviewComment('');
      setReviewRating(5);
    } catch (err: any) {
      showToast.error(err?.data?.message || 'Failed to post review');
    }
  };

  const handleSaveService = async () => {
    if (!isAuthenticated) {
      showToast.error('Please log in to save services');
      router.push(`/login?redirect=/services/${id}`);
      return;
    }

    try {
      await trackSave(id).unwrap();
      setSaved(true);
      showToast.success('Service saved to your bookmarks!');
    } catch (err: any) {
      showToast.error(err?.data?.message || 'Failed to save service');
    }
  };

  if (isServiceLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton height="360px" className="rounded-2xl" />
            <Skeleton width="60%" height="32px" />
            <Skeleton width="40%" height="20px" />
            <Skeleton height="150px" />
          </div>
          <div className="space-y-6">
            <Skeleton height="280px" className="rounded-2xl" />
            <Skeleton height="150px" className="rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  if (!service) {
    return (
      <main className="mx-auto max-w-3xl py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 font-display">Service Not Found</h2>
        <p className="mt-2 text-gray-500">The service listing you are looking for does not exist or has been removed.</p>
        <Link href="/explore" className="mt-6 inline-block">
          <Button>Back to Explore</Button>
        </Link>
      </main>
    );
  }

  const provider = service.providerId as any;
  const isOwner = user?._id === provider?._id;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Service Header Info */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">{service.category}</Badge>
            {service.city && (
              <span className="inline-flex items-center text-sm text-gray-500">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {service.city}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight font-display">{service.title}</h1>
          <div className="flex items-center gap-4">
            <Rating value={service.avgRating} count={service.reviewCount} />
            <span className="text-sm text-gray-300">|</span>
            <span className="text-sm text-gray-600">Offered by {provider?.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSaveService}
            disabled={saved || isSaving}
            className="flex items-center gap-2"
          >
            {saved ? (
              <BookmarkSolidIcon className="h-5 w-5 text-tertiary" />
            ) : (
              <BookmarkIcon className="h-5 w-5 text-gray-400" />
            )}
            {saved ? 'Saved' : 'Save Listing'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Images Gallery */}
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 shadow-sm aspect-video max-h-[420px] flex items-center justify-center">
            {service.images?.[0] ? (
              <img
                src={service.images[0]}
                alt={service.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-6xl text-gray-300 font-bold font-display">{service.category[0]}</span>
            )}
          </div>

          {/* Service Overview */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 font-display">Service Overview</h2>
            <p className="text-gray-600 text-lg leading-relaxed">{service.shortDescription}</p>
            <hr className="border-gray-100" />
            <div className="prose prose-gray max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
              {service.fullDescription}
            </div>
          </div>

          {/* Details Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl border border-gray-100 bg-white p-6">
            <div className="flex items-start gap-3">
              <ClockIcon className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">Availability</h4>
                <p className="mt-1 text-sm text-gray-600">{service.availability || 'Flexible availability'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPinIcon className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">Service Location</h4>
                <p className="mt-1 text-sm text-gray-600">{service.location || 'Online or Client\'s choice'}</p>
              </div>
            </div>
            {service.tags && service.tags.length > 0 && (
              <div className="flex items-start gap-3 md:col-span-2">
                <TagIcon className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Tags</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {service.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Provider Card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 font-display">About the Provider</h3>
            <div className="flex items-center gap-4">
              <Avatar name={provider?.name || 'P'} size="lg" />
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">{provider?.name}</h4>
                <p className="text-sm text-gray-500">Member since {new Date(provider?.createdAt).getFullYear()}</p>
              </div>
            </div>
            {provider?.bio && <p className="text-gray-600 leading-relaxed">{provider.bio}</p>}
            {provider?.location && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <MapPinIcon className="h-4 w-4" />
                Based in {provider.location}
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 font-display">Reviews ({reviews.length})</h3>

            {/* Write Review Form */}
            {isAuthenticated && !isOwner && (
              <form onSubmit={handleReviewSubmit} className="rounded-2xl border border-primary/10 bg-primary/[0.02] p-6 space-y-4">
                <h4 className="font-semibold text-gray-900">Write a Review</h4>
                <div className="flex gap-4 items-center">
                  <span className="text-sm text-gray-600">Your Rating:</span>
                  <Select
                    value={reviewRating.toString()}
                    onChange={(e) => setReviewRating(parseInt(e.target.value))}
                    options={[
                      { value: '5', label: '5 Stars' },
                      { value: '4', label: '4 Stars' },
                      { value: '3', label: '3 Stars' },
                      { value: '2', label: '2 Stars' },
                      { value: '1', label: '1 Star' },
                    ]}
                  />
                </div>
                <div>
                  <textarea
                    rows={4}
                    placeholder="Share your experience working with this provider..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <Button type="submit" loading={isReviewLoading}>Submit Review</Button>
              </form>
            )}

            {/* Review Cards list */}
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-sm">No reviews yet for this listing. Be the first to add one!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev: any) => (
                  <div key={rev._id} className="border-b border-gray-100 pb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar name={rev.userId?.name || 'User'} size="sm" />
                        <span className="text-sm font-semibold text-gray-900">{rev.userId?.name || 'Customer'}</span>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Rating value={rev.rating} count={0} size="sm" />
                    <p className="text-sm text-gray-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Bookings Panel */}
        <div className="space-y-6">
          {/* AI Match Score Card */}
          {isAuthenticated && matchScore !== undefined && (
            <Card className="border border-secondary/20 bg-gradient-to-br from-secondary/[0.04] to-primary/[0.02] p-6 space-y-4">
              <div className="flex items-center gap-2 text-secondary">
                <SparklesIcon className="h-6 w-6 animate-pulse" />
                <h3 className="font-bold text-lg font-display">AI Smart Match</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-secondary font-display">{matchScore}%</span>
                <span className="text-sm font-semibold text-gray-500">compatibility</span>
              </div>
              {matchReason && <p className="text-sm text-gray-600 leading-relaxed">{matchReason}</p>}
            </Card>
          )}

          {/* Booking Request Card */}
          <Card className="p-6 sticky top-24 shadow-md space-y-6">
            <div>
              <span className="text-2xl font-bold text-primary font-display">
                {formatPrice(service.price, service.priceUnit)}
              </span>
            </div>

            {isOwner ? (
              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-600 font-medium">This is your service listing.</p>
                <Link href={`/services/add?id=${id}`} className="mt-3 block">
                  <Button variant="outline" className="w-full">Edit Listing</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                <Input
                  label="Select Reservation Date"
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Reservation Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Provide details about your needs (e.g. details, size of space, specific topics)..."
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Button type="submit" loading={isBookingLoading} className="w-full h-12">
                  Request Booking
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <div className="pt-8 border-t border-gray-100 space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 font-display">Related Services</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {relatedServices.slice(0, 4).map((relService: Service) => (
              <ServiceCard key={relService._id} service={relService} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
