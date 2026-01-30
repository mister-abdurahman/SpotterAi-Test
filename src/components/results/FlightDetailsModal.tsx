import { useState, useEffect } from 'react';
import { X, Plane, Clock, ShieldCheck, ArrowRight, Luggage, Bookmark, Trash2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { FlightOffer } from '../../types';
import { Button, cn } from '../ui';

interface FlightDetailsModalProps {
  flight: FlightOffer;
  isOpen: boolean;
  onClose: () => void;
}

export const FlightDetailsModal = ({ flight, isOpen, onClose }: FlightDetailsModalProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const location = useLocation();
  const isBookmarksPage = location.pathname === '/bookmarks';

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('bookmarkedFlights');
      if (saved) {
        const flights = JSON.parse(saved) as FlightOffer[];
        setIsBookmarked(flights.some(f => f.id === flight.id));
      }
    }
  }, [isOpen, flight.id]);

  if (!isOpen) return null;

  const itinerary = flight.itineraries[0];
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDuration = (duration: string) => {
    return duration.replace('PT', '').replace('H', 'h ').replace('M', 'm');
  };

  const handleBookmarkAction = () => {
    const saved = localStorage.getItem('bookmarkedFlights');
    let flights: FlightOffer[] = saved ? JSON.parse(saved) : [];

    if (isBookmarksPage || isBookmarked) {
      // Remove from bookmarks
      flights = flights.filter(f => f.id !== flight.id);
      localStorage.setItem('bookmarkedFlights', JSON.stringify(flights));
      setIsBookmarked(false);
      
      // Dispatch custom event to notify BookmarksPage if we are on it
      window.dispatchEvent(new Event('bookmarksUpdated'));
      
      if (isBookmarksPage) {
        onClose();
      }
    } else {
      // Add to bookmarks
      if (!flights.some(f => f.id === flight.id)) {
        flights.push(flight);
        localStorage.setItem('bookmarkedFlights', JSON.stringify(flights));
        setIsBookmarked(true);
        window.dispatchEvent(new Event('bookmarksUpdated'));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-darker-blue/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 text-brand-dark-blue">
          <div className="text-left">
            <h2 className="text-xl font-black text-white italic">FLIGHT <span className="text-brand-teal">DETAILS</span></h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Select your preferred journey</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Main Route Info */}
          <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-800">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-brand-teal/10 rounded-lg">
                      <Plane className="w-5 h-5 text-brand-teal" />
                   </div>
                   <span className="text-sm font-black text-white uppercase tracking-tighter">
                      {itinerary.segments[0].departure.iataCode} — {itinerary.segments[itinerary.segments.length - 1].arrival.iataCode}
                   </span>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                   {formatDuration(itinerary.duration)}
                </span>
             </div>

             <div className="space-y-6">
                {itinerary.segments.map((segment, idx) => (
                   <div key={segment.id} className="relative pl-8 text-left">
                      {/* Connection Line */}
                      {idx < itinerary.segments.length - 1 && (
                         <div className="absolute left-3.5 top-8 bottom-[-8px] w-0.5 border-l-2 border-dashed border-slate-700" />
                      )}
                      
                      {/* Segment Marker */}
                      <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-brand-teal" />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div className="space-y-1">
                            <p className="text-lg font-black text-white">{formatTime(segment.departure.at)}</p>
                            <p className="text-xs font-bold text-slate-500 uppercase">{formatDate(segment.departure.at)}</p>
                            <p className="text-sm font-medium text-brand-teal">{segment.departure.iataCode}</p>
                         </div>
                         
                         <div className="flex flex-col justify-center items-center md:items-start opacity-60">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                               <Clock className="w-3 h-3" /> {formatDuration(segment.duration)}
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 mt-1">
                               {segment.carrierCode} {segment.number}
                            </p>
                         </div>

                         <div className="space-y-1 md:text-right">
                            <p className="text-lg font-black text-white">{formatTime(segment.arrival.at)}</p>
                            <p className="text-xs font-bold text-slate-500 uppercase">{formatDate(segment.arrival.at)}</p>
                            <p className="text-sm font-medium text-brand-teal">{segment.arrival.iataCode}</p>
                         </div>
                      </div>

                      {/* Layover Info */}
                      {idx < itinerary.segments.length - 1 && (
                         <div className="mt-4 mb-2 flex items-center gap-3">
                            <div className="h-px flex-1 bg-slate-800" />
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-1 rounded">
                               Layover at {segment.arrival.iataCode}
                            </span>
                            <div className="h-px flex-1 bg-slate-800" />
                         </div>
                      )}
                   </div>
                ))}
             </div>
          </div>

          {/* Pricing & Amenities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-slate-800/30 rounded-2xl p-5 border border-slate-800 space-y-4 text-left">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Included Amenities</h3>
                <div className="flex flex-wrap gap-2">
                   <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                      <Luggage className="w-3.5 h-3.5 text-brand-teal" />
                      <span className="text-[10px] font-bold text-slate-300">Hand luggage</span>
                   </div>
                   <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
                      <span className="text-[10px] font-bold text-slate-300">Basic Insurance</span>
                   </div>
                </div>
             </div>
             
             <div className="bg-slate-800/30 rounded-2xl p-5 border border-slate-800 flex flex-col justify-center text-left md:text-right">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Price Breakdown</h3>
                <div className="flex items-baseline gap-1 md:justify-end">
                   <span className="text-sm font-semibold text-slate-500">{flight.price.currency}</span>
                   <span className="text-4xl font-black text-white tracking-tighter">{Math.round(parseFloat(flight.price.total))}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-tight">Inc. all taxes and fees</p>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 rounded-b-3xl">
          <Button 
            onClick={handleBookmarkAction}
            disabled={!isBookmarksPage && isBookmarked}
            className={cn(
               "w-full py-4 rounded-2xl text-lg font-black italic tracking-tight flex gap-3 group transition-all duration-300",
               isBookmarksPage 
                  ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white" 
                  : isBookmarked 
                     ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                     : "bg-brand-teal text-brand-darker-blue hover:scale-[1.02] active:scale-95 shadow-xl shadow-brand-teal/20"
            )}
          >
            {isBookmarksPage ? (
              <>REMOVE FROM BOOKMARKS <Trash2 className="w-5 h-5" /></>
            ) : isBookmarked ? (
              <>ALREADY BOOKMARKED <Bookmark className="w-5 h-5 fill-slate-500" /></>
            ) : (
              <>BOOKMARK BOOKING <Bookmark className="w-5 h-5 group-hover:scale-110 transition-transform" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
