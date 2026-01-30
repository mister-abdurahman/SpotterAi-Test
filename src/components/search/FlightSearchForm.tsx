import { useState, FormEvent, useRef } from 'react';
import { Calendar, Users, PlaneTakeoff, Loader2 } from 'lucide-react';
import { CitySelect } from './CitySelect';
import { Button } from '../ui';
import { useFilter } from '../../store/FilterContext';

interface FlightSearchFormProps {
  isLoading: boolean;
}

export const FlightSearchForm = ({ isLoading }: FlightSearchFormProps) => {
  const { searchParams, updateSearchParams } = useFilter();
  const [localParams, setLocalParams] = useState(searchParams);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateSearchParams(localParams);
  };

  const handleDateClick = () => {
    if (dateInputRef.current) {
      try {
        dateInputRef.current.showPicker();
      } catch (err) {
        // Fallback for browsers that don't support showPicker()
        dateInputRef.current.focus();
      }
    }
  };

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-800/50">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        <div className="md:col-span-3">
          <CitySelect
            label="Origin"
            placeholder="Where from?"
            value={localParams.origin}
            onChange={(code) => setLocalParams(prev => ({ ...prev, origin: code }))}
          />
        </div>

        <div className="hidden md:flex md:col-span-1 justify-center pb-3">
            <div className="p-2 rounded-full bg-slate-800/50 border border-slate-700/50">
                <PlaneTakeoff className="w-5 h-5 text-brand-teal rotate-90" />
            </div>
        </div>

        <div className="md:col-span-3">
          <CitySelect
            label="Destination"
            placeholder="Where to?"
            value={localParams.destination}
            onChange={(code) => setLocalParams(prev => ({ ...prev, destination: code }))}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
            Departure
          </label>
          <div className="relative group cursor-pointer" onClick={handleDateClick}>
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-teal transition-colors z-10 pointer-events-none" />
            <input
              ref={dateInputRef}
              type="date"
              value={localParams.departureDate}
              onChange={(e) => setLocalParams(prev => ({ ...prev, departureDate: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all color-scheme-dark cursor-pointer"
            />
          </div>
        </div>

        <div className="md:col-span-1">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
            Adults
          </label>
          <div className="relative group">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-teal transition-colors" />
            <input
              type="number"
              min="1"
              max="9"
              value={localParams.adults}
              onChange={(e) => setLocalParams(prev => ({ ...prev, adults: parseInt(e.target.value) }))}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <Button 
            type="submit" 
            className="w-full py-4 text-base font-black bg-brand-teal text-brand-darker-blue hover:bg-brand-teal/90 shadow-xl shadow-brand-teal/10 flex gap-2 rounded-xl transition-all hover:scale-[1.02] active:scale-95"
            disabled={isLoading || !localParams.origin || !localParams.destination || !localParams.departureDate}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search Flights"}
          </Button>
        </div>
      </form>
    </div>
  );
};
