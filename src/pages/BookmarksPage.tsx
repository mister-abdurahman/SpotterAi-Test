import { useState, useEffect } from 'react';
import { Bookmark, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FlightOffer } from '../types';
import { FlightCard } from '../components/results/FlightCard';

export const BookmarksPage = () => {
  const [bookmarkedFlights, setBookmarkedFlights] = useState<FlightOffer[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('bookmarkedFlights');
    if (saved) {
      setBookmarkedFlights(JSON.parse(saved));
    }
  }, []);

  // Listen for changes in localStorage (in case a removal happens within a modal on this page)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('bookmarkedFlights');
      if (saved) {
        setBookmarkedFlights(JSON.parse(saved));
      } else {
        setBookmarkedFlights([]);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-window updates
    window.addEventListener('bookmarksUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bookmarksUpdated', handleStorageChange);
    };
  }, []);

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
           <Link 
            to="/" 
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
           >
              <ArrowLeft className="w-5 h-5" />
           </Link>
           <div>
              <h2 className="text-3xl font-black text-white italic tracking-tight">MY <span className="text-brand-teal">BOOKMARKS</span></h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Saved journeys for your next adventure</p>
           </div>
        </div>
        <div className="bg-brand-teal/10 px-4 py-2 rounded-xl border border-brand-teal/20">
            <span className="text-brand-teal font-black">{bookmarkedFlights.length}</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Saved</span>
        </div>
      </div>

      {bookmarkedFlights.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-slate-900/50 rounded-3xl border border-slate-800 border-dashed animate-in fade-in duration-700">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <Bookmark className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2 italic">Nothing saved yet</h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm font-medium leading-relaxed">
            Your bookmarked flights will appear here. Start searching for your next destination!
          </p>
          <Link 
            to="/" 
            className="mt-8 bg-brand-teal text-brand-darker-blue px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-teal/90 transition-all hover:scale-105 active:scale-95"
          >
            Start Searching
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {bookmarkedFlights.map((flight) => (
            <FlightCard 
                key={flight.id} 
                flight={flight} 
                isBestValue={false}
                isCheapest={false}
                isFastest={false}
            />
          ))}
        </div>
      )}
    </main>
  );
};
