'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import ChartWidget from './ChartWidget';

const COLORS = ['#6D5AE6', '#00B8A9', '#FF7A59', '#94a3b8'];

interface Props {
  data?: { _id: string; count: number }[];
  loading?: boolean;
}

export default function StatusPieChart({ data = [], loading }: Props) {
  return (
    <ChartWidget title="Booking Status" loading={loading}>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </ChartWidget>
  );
}
