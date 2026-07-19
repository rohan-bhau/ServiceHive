'use client';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';

interface ChartWidgetProps {
  title: string;
  loading?: boolean;
  children?: React.ReactNode;
}

export default function ChartWidget({ title, loading, children }: ChartWidgetProps) {
  return (
    <Card padding="md">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">{title}</h3>
      {loading ? <Skeleton height="200px" /> : children}
    </Card>
  );
}
