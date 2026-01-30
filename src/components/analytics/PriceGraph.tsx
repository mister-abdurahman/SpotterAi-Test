import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { usePriceTrends } from '../../hooks/usePriceTrends';
import { Skeleton } from '../ui';
import { TrendingUp } from 'lucide-react';
import { FlightOffer } from '../../types';

interface PriceGraphProps {
  flights: FlightOffer[];
  isLoading: boolean;
}

export const  PriceGraph = ({ flights, isLoading }: PriceGraphProps) => {
  const { chartData } = usePriceTrends(flights);

  console.log("flights::", flights)
  console.log("chartData::", chartData)

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-2xl" />;
  }

  if (chartData.length < 2) {
    return null;
  }

  return (
    <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-100 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-teal-500">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-300 leading-none">Price Trend</h3>
          <p className="text-xs font-medium text-slate-400 mt-1">Lowest prices across selected dates</p>
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#008080" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#008080" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="displayDate" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
                color: '#008080'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#008080" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
