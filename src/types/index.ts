export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  adults: number;
}

export interface Filters {
  maxPrice: number;
  airlines: string[];
  stops: string;
  sortBy: string;
}

export interface FilterContextType {
  searchParams: SearchParams;
  filters: Filters;
  updateFilters: (newFilters: Partial<Filters>) => void;
  updateSearchParams: (params: Partial<SearchParams>) => void;
}

export interface FlightOffer {
  id: string;
  price: {
    total: string;
    currency: string;
  };
  itineraries: Array<{
    duration: string;
    segments: Array<{
      id: string;
      departure: { iataCode: string; at: string };
      arrival: { iataCode: string; at: string };
      carrierCode: string;
      number: string;
      duration: string;
    }>;
  }>;
  validatingAirlineCodes: string[];
}

export interface City {
  id: string;
  name: string;
  iataCode: string;
  address: {
    cityName: string;
    countryName: string;
  };
}
