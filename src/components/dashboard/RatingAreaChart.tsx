'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartWidget from './ChartWidget';

interface Props {
  data?: { _id: string; avg: number }[];
  loading?: boolean;
}

export default function RatingAreaChart({ data = [], loading }: Props) {
  return (
    <ChartWidget title="Rating Trend" loading={loading}>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Area type="monotone" dataKey="avg" stroke="#FF7A59" fill="#FF7A59" fillOpacity={0.1} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWidget>
  );
}
