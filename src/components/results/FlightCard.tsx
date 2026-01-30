import { useState } from 'react';
import { Plane, Clock, ArrowRight, TrendingDown, Zap } from 'lucide-react';
import { cn } from '../ui';
import { FlightOffer } from '../../types';
import { FlightDetailsModal } from './FlightDetailsModal';

interface FlightCardProps {
  flight: FlightOffer;
  isBestValue: boolean;
  isCheapest: boolean;
  isFastest: boolean;
}

export const FlightCard = ({ flight, isBestValue, isCheapest, isFastest }: FlightCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itinerary = flight.itineraries[0];
  const departure = itinerary.segments[0].departure;
  const arrival = itinerary.segments[itinerary.segments.length - 1].arrival;
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStops = (segments: FlightOffer['itineraries'][0]['segments']) => {
    const stops = segments.length - 1;
    if (stops === 0) return 'Non-stop';
    return `${stops} stop${stops > 1 ? 's' : ''}`;
  };

  const formatDuration = (duration: string) => {
    return duration.replace('PT', '').replace('H', 'h ').replace('M', 'm');
  };

  return (
    <div className={cn(
      "group relative bg-slate-900 border border-slate-800 hover:border-brand-teal/30 hover:shadow-2xl hover:shadow-brand-teal/5 transition-all duration-300 rounded-2xl p-6",
      isBestValue && "ring-2 ring-brand-teal/50 border-brand-teal/30"
    )}>
      {/* Badges */}
      <div className="absolute -top-3 left-6 flex gap-2">
        {isBestValue && (
          <span className="bg-brand-teal text-brand-darker-blue text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-brand-teal/20">
            <Zap className="w-3 h-3" /> Best Value
          </span>
        )}
        {isCheapest && !isBestValue && (
          <span className="bg-brand-teal text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-brand-indigo/20">
            <TrendingDown className="w-3 h-3" /> Cheapest
          </span>
        )}
        {isFastest && !isBestValue && (
          <span className="bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-amber-500/20">
            <Clock className="w-3 h-3" /> Fastest
          </span>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        {/* Flight Path */}
        <div className="flex-1 flex items-center gap-6 md:gap-12">
          {/* Airline Logo Placeholder */}
          <div className="w-12 h-12 bg-slate-800 border border-slate-700/50 rounded-xl flex items-center justify-center shrink-0">
             <Plane className="w-6 h-6 text-slate-500 group-hover:text-brand-teal transition-colors" />
          </div>

          <div className="flex-1 flex items-center justify-between max-w-md">
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-white">{formatDate(departure.at)}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{departure.iataCode}</p>
            </div>

            <div className="flex-1 flex flex-col items-center px-4">
              <p className="text-xs font-medium text-slate-500 mb-2">{formatDuration(itinerary.duration)}</p>
              <div className="relative w-full h-px bg-slate-800">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-slate-700 bg-slate-900" />
              </div>
              <p className="text-xs font-black text-brand-teal mt-2 uppercase tracking-wide">
                {getStops(itinerary.segments)}
              </p>
            </div>

            <div className="text-center md:text-right">
              <p className="text-2xl font-bold text-white">{formatDate(arrival.at)}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{arrival.iataCode}</p>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-10">
          <div className="text-left md:text-right">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Total Price</p>
            <div className="flex items-baseline gap-1">
                <span className="text-sm font-semibold text-slate-600">{flight.price.currency}</span>
                <span className="text-3xl font-black text-white tracking-tight">{Math.round(parseFloat(flight.price.total))}</span>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-0 md:mt-4 bg-white text-brand-darker-blue px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-teal transition-all hover:translate-x-1 flex items-center gap-2"
          >
            Details <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <FlightDetailsModal 
        flight={flight}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
