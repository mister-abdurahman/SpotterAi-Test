import { useMemo } from 'react';
import { X } from 'lucide-react';
import { useFilter } from '../../store/FilterContext';
import { Button } from '../ui';
import { SORT_OPTIONS } from '../../constants';
import { FlightOffer } from '../../types';

interface FilterSidebarProps {
  flights: FlightOffer[];
  isOpen: boolean;
  onClose: () => void;
}

export const FilterSidebar = ({ flights, isOpen, onClose }: FilterSidebarProps) => {
  const { filters, updateFilters } = useFilter();

  // Extract unique airlines from available flights
  const airlines = useMemo(() => {
    if (!flights) return [];
    const codes = new Set<string>();
    flights.forEach(f => f.validatingAirlineCodes.forEach(code => codes.add(code)));
    return Array.from(codes);
  }, [flights]);

  const handleAirlineToggle = (code: string) => {
    const newAirlines = filters.airlines.includes(code)
       ? filters.airlines.filter(a => a !== code)
       : [...filters.airlines, code];
     updateFilters({ airlines: newAirlines });
   };

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-80 bg-brand-darker-blue border-r border-slate-800/50 p-6 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
      ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="flex items-center justify-between mb-8 lg:hidden">
        <h2 className="text-xl font-bold text-white">Filters</h2>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800"><X className="w-6 h-6 text-slate-400" /></button>
      </div>

      <div className="space-y-10">
        {/* Sort By */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Sort By</h3>
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => updateFilters({ sortBy: SORT_OPTIONS.CHEAPEST })}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${filters.sortBy === SORT_OPTIONS.CHEAPEST ? 'bg-slate-800 text-brand-teal shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Cheapest
            </button>
            <button
              onClick={() => updateFilters({ sortBy: SORT_OPTIONS.FASTEST })}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${filters.sortBy === SORT_OPTIONS.FASTEST ? 'bg-slate-800 text-brand-teal shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Fastest
            </button>
          </div>
        </div>

        {/* Max Price */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Max Price</h3>
            <span className="text-sm font-bold text-brand-teal">${filters.maxPrice}</span>
          </div>
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={filters.maxPrice}
            onChange={(e) => updateFilters({ maxPrice: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-teal"
          />
        </div>

        {/* Stops */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Stops</h3>
          <div className="space-y-2">
            {['any', '0', '1', '2+'].map((stop) => (
              <label key={stop} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="stops"
                  className="hidden"
                  checked={filters.stops === stop}
                  onChange={() => updateFilters({ stops: stop })}
                />
                <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${filters.stops === stop ? 'bg-brand-teal border-brand-teal' : 'border-slate-800 group-hover:border-slate-700'}`}>
                  {filters.stops === stop && <div className="w-2 h-2 rounded-full bg-brand-darker-blue" />}
                </div>
                <span className={`text-sm font-medium transition-colors ${filters.stops === stop ? 'text-white' : 'text-slate-500'}`}>
                  {stop === 'any' ? 'Any stops' : stop === '0' ? 'Non-stop' : stop === '1' ? '1 stop' : '2+ stops'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Airlines */}
        {airlines.length > 0 && (
          <div className="animate-in fade-in duration-500">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Airlines</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {airlines.map((code) => (
                <label key={code} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={filters.airlines.includes(code)}
                    onChange={() => handleAirlineToggle(code)}
                  />
                  <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${filters.airlines.includes(code) ? 'bg-brand-teal border-brand-teal shadow-lg shadow-brand-teal/10' : 'border-slate-800 group-hover:border-slate-700'}`}>
                    {filters.airlines.includes(code) && <div className="w-1.5 h-1.5 rounded-full bg-brand-darker-blue" />}
                  </div>
                  <span className={`text-sm font-medium transition-colors ${filters.airlines.includes(code) ? 'text-white' : 'text-slate-500'}`}>
                    {code}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reset Button */}
      <Button
        variant="ghost"
        size="sm"
        className="mt-10 w-full text-brand-teal hover:bg-brand-teal/10 border border-transparent hover:border-brand-teal/20"
        onClick={() => updateFilters({ maxPrice: 2000, airlines: [], stops: 'any', sortBy: SORT_OPTIONS.CHEAPEST })}
      >
        Reset all filters
      </Button>
    </aside>
  );
};
