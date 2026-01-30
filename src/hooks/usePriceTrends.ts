import { useMemo } from 'react';
import { FlightOffer } from '../types';

/**
 * Hook to format price trends for Recharts
 * @param {Array} flights Filtered flights from useFlights
 */
export const usePriceTrends = (flights: FlightOffer[]) => {
  const chartData = useMemo(() => {
    if (!flights || flights.length === 0) return [];

    // Check if we have multiple days
    const dates = new Set(flights.map(f => f.itineraries[0].segments[0].departure.at.split('T')[0]));
    const isSingleDay = dates.size <= 1;

    // Group by either Date or Hour based on range
    const dataMap: Record<string, { price: number; displayDate: string; sortKey: number }> = {};

    flights.forEach((flight) => {
      const departureAt = flight.itineraries[0].segments[0].departure.at;
      const dateObj = new Date(departureAt);
      
      // key: YYYY-MM-DD or YYYY-MM-DDTHH
      const key = isSingleDay 
        ? departureAt.substring(0, 13) // Group by hour
        : departureAt.split('T')[0]; // Group by day
      
      const price = parseFloat(flight.price.total);

      if (!dataMap[key] || price < dataMap[key].price) {
        dataMap[key] = {
          price,
          displayDate: isSingleDay 
            ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          sortKey: dateObj.getTime()
        };
      }
    });

    // Convert to sorted array for Recharts
    return Object.values(dataMap)
      .sort((a, b) => a.sortKey - b.sortKey);
  }, [flights]);

  return { chartData };
};
