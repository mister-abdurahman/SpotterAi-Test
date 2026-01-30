import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import amadeusClient from '../api/amadeus.client';
import { AMADEUS_CONFIG, SORT_OPTIONS } from '../constants';
import { useFilter } from '../store/FilterContext';
import { FlightOffer } from '../types';

/**
 * Hook to fetch and filter flight offers
 */
export const useFlights = () => {
  const { searchParams, filters } = useFilter();

  // Fetch flight offers from Amadeus
  const { data: rawFlights, isLoading, error, refetch } = useQuery<FlightOffer[]>({
    queryKey: ['flights', searchParams],
    queryFn: async () => {
      if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
        return [];
      }

      const response = await amadeusClient.get(AMADEUS_CONFIG.FLIGHT_OFFERS_ENDPOINT, {
        params: {
          originLocationCode: searchParams.origin,
          destinationLocationCode: searchParams.destination,
          departureDate: searchParams.departureDate,
          adults: searchParams.adults,
          max: 50, // Limit results for demo
        },
      });

      return response.data.data;
    },
    enabled: !!(searchParams.origin && searchParams.destination && searchParams.departureDate),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Local filtering and sorting logic
  const filteredFlights = useMemo(() => {
    if (!rawFlights) return [];

    let result = [...rawFlights];

    // 1. Filter by Stops
    if (filters.stops !== 'any') {
      result = result.filter((flight) => {
        const totalStops = flight.itineraries[0].segments.length - 1;
        if (filters.stops === '0') return totalStops === 0;
        if (filters.stops === '1') return totalStops === 1;
        if (filters.stops === '2+') return totalStops >= 2;
        return true;
      });
    }

    // 2. Filter by Price
    result = result.filter((flight) => parseFloat(flight.price.total) <= filters.maxPrice);

    // 3. Filter by Airlines
    if (filters.airlines.length > 0) {
      result = result.filter((flight) => 
        filters.airlines.includes(flight.validatingAirlineCodes[0])
      );
    }

    // 4. Sort
    result.sort((a, b) => {
      if (filters.sortBy === SORT_OPTIONS.CHEAPEST) {
        return parseFloat(a.price.total) - parseFloat(b.price.total);
      } else if (filters.sortBy === SORT_OPTIONS.FASTEST) {
        // Calculate total duration in minutes
        const getDuration = (flight: FlightOffer) => {
          const durationStr = flight.itineraries[0].duration; // e.g., "PT12H30M"
          const match = durationStr.match(/PT(\d+H)?(\d+M)?/);
          if (!match) return 0;
          const hours = parseInt(match[1]) || 0;
          const minutes = parseInt(match[2]) || 0;
          return hours * 60 + minutes;
        };
        return getDuration(a) - getDuration(b);
      }
      return 0;
    });

    return result;
  }, [rawFlights, filters]);

  // Identify Best Value, Cheapest, Fastest
  const flightStats = useMemo(() => {
    if (filteredFlights.length === 0) return null;

    const findMin = (arr: FlightOffer[], fn: (f: FlightOffer) => number) => 
      arr.reduce((min, cur) => fn(cur) < fn(min) ? cur : min, arr[0]);

    const getDuration = (f: FlightOffer) => {
        const match = f.itineraries[0].duration.match(/PT(\d+H)?(\d+M)?/);
        if (!match) return 0;
        return (parseInt(match[1]) || 0) * 60 + (parseInt(match[2]) || 0);
    };

    const cheapest = findMin(filteredFlights, f => parseFloat(f.price.total));
    const fastest = findMin(filteredFlights, getDuration);
    
    // Best Value: weighted score (price is usually 70% weight, duration 30%)
    const bestValue = findMin(filteredFlights, f => {
        const p = parseFloat(f.price.total);
        const d = getDuration(f);
        return p * 0.7 + d * 0.3; // Simple heuristic
    });

    return {
      cheapestId: cheapest.id,
      fastestId: fastest.id,
      bestValueId: bestValue.id
    };
  }, [filteredFlights]);

  return {
    flights: filteredFlights,
    stats: flightStats,
    isLoading,
    error,
    refetch
  };
};
