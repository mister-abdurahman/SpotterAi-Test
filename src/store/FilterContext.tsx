import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { SORT_OPTIONS } from '../constants';
import { FilterContextType, Filters, SearchParams } from '../types';

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    origin: '',
    destination: '',
    departureDate: '',
    adults: 1,
  });

  const [filters, setFilters] = useState<Filters>({
    maxPrice: 2000,
    airlines: [],
    stops: 'any', // 'any', '0', '1', '2+'
    sortBy: SORT_OPTIONS.CHEAPEST,
  });

  const updateFilters = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const updateSearchParams = (params: Partial<SearchParams>) => {
    setSearchParams((prev) => ({ ...prev, ...params }));
  };

  const value = useMemo(() => ({
    searchParams,
    filters,
    updateFilters,
    updateSearchParams,
  }), [searchParams, filters]);

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
