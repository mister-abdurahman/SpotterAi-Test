import { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import amadeusClient from '../api/amadeus.client';
import { AMADEUS_CONFIG } from '../constants';
import { City } from '../types';

/**
 * Hook for debounced airport/city search
 */
export const useCitySearch = () => {
  const [results, setResults] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = useCallback(
    debounce(async (keyword: string) => {
      if (!keyword || keyword.length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await amadeusClient.get(AMADEUS_CONFIG.AIRPORT_SEARCH_ENDPOINT, {
          params: {
            subType: 'CITY,AIRPORT',
            keyword,
            'page[limit]': 10,
          },
        });
        setResults(response.data.data || []);
      } catch (error) {
        console.error('City search failed:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    []
  );

  return { search, results, isSearching };
};
