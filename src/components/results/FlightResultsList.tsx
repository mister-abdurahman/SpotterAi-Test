import { FlightCard } from './FlightCard';
import { Skeleton } from '../ui';
import { Plane, Info } from 'lucide-react';
import { FlightOffer } from '../../types';

interface FlightResultsListProps {
  flights: FlightOffer[];
  stats: {
    bestValueId: string;
    cheapestId: string;
    fastestId: string;
  } | null;
  isLoading: boolean;
}

export const FlightResultsList = ({ flights, stats, isLoading }: FlightResultsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!flights || flights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-900/50 rounded-2xl border border-slate-800 shadow-sm animate-in fade-in duration-700">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <Plane className="w-8 h-8 text-slate-600" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No flights found</h3>
        <p className="text-slate-500 max-w-xs mx-auto text-sm">
          We couldn't find any flights for your search. Try adjusting your filters or destination.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6 bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl">
        <Info className="w-4 h-4 text-brand-teal" />
        <span>Found <span className="text-white font-bold">{flights.length}</span> flights matching your criteria.</span>
      </div>
      
      {flights.map((flight) => (
        <FlightCard
          key={flight.id}
          flight={flight}
          isBestValue={stats?.bestValueId === flight.id}
          isCheapest={stats?.cheapestId === flight.id}
          isFastest={stats?.fastestId === flight.id}
        />
      ))}
    </div>
  );
};
