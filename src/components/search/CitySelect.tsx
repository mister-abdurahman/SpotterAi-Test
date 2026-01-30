import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useCitySearch } from '../../hooks/useCitySearch';
import { City } from '../../types';

interface CitySelectProps {
  value: string;
  onChange: (iataCode: string, name: string) => void;
  placeholder?: string;
  label?: string;
}

export const CitySelect = ({ value, onChange, placeholder, label }: CitySelectProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const { search, results, isSearching } = useCitySearch() as {
    search: (keyword: string) => void;
    results: City[];
    isSearching: boolean;
  };
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    search(val);
    setIsOpen(true);
  };

  const handleSelect = (city: City) => {
    onChange(city.iataCode, `${city.name} (${city.iataCode})`);
    setInputValue(`${city.name} (${city.iataCode})`);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
        {label}
      </label>
      <div className="relative group">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-teal transition-colors" />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-teal animate-spin" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {results.map((city) => (
            <button
              key={city.id}
              onClick={() => handleSelect(city)}
              className="w-full px-4 py-3 flex items-start gap-3 hover:bg-slate-800 transition-colors text-left border-b border-slate-800 last:border-0"
            >
              <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-slate-700 transition-colors">
                <MapPin className="w-4 h-4 text-brand-teal" />
              </div>
              <div>
                <p className="font-bold text-white">{city.name} <span className="text-brand-teal text-xs ml-1 bg-brand-teal/10 px-1.5 py-0.5 rounded">{city.iataCode}</span></p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{city.address.cityName}, {city.address.countryName}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
