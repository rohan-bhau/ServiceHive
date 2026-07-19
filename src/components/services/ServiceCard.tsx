import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Rating from '@/components/ui/Rating';
import Avatar from '@/components/ui/Avatar';
import { formatPrice, cn } from '@/lib/utils';
import type { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
  className?: string;
}

export default function ServiceCard({ service, className }: ServiceCardProps) {
  const providerName = typeof service.providerId === 'object' ? service.providerId.name : 'Provider';

  return (
    <Link href={`/services/${service._id}`}>
      <Card hover padding="none" className={cn('overflow-hidden', className)}>
        <div
          className="flex h-40 items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20"
        >
          {service.images?.[0] ? (
            <img src={service.images[0]} alt={service.title} className="h-full w-full object-cover" />
          ) : (
            <span className="text-4xl text-gray-300">{service.category[0]}</span>
          )}
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 line-clamp-1">{service.title}</h3>
            <Badge variant="default">{service.category}</Badge>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{service.shortDescription}</p>
          <div className="flex items-center gap-2">
            <Rating value={service.avgRating} count={service.reviewCount} size="sm" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar name={providerName} size="sm" />
              <span className="text-sm text-gray-600">{providerName}</span>
            </div>
            <span className="font-bold text-primary">{formatPrice(service.price, service.priceUnit)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
