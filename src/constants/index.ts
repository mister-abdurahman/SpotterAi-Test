export const AMADEUS_CONFIG = {
  BASE_URL: 'https://test.api.amadeus.com',
  AUTH_ENDPOINT: '/v1/security/oauth2/token',
  FLIGHT_OFFERS_ENDPOINT: '/v2/shopping/flight-offers',
  AIRPORT_SEARCH_ENDPOINT: '/v1/reference-data/locations',
};

export const TOKEN_EXPIRY_BUFFER = 300; // 5 minutes buffer before actual expiry (30 mins total)

export const FILTER_TYPES = {
  STOPS: 'stops',
  PRICE: 'price',
  AIRLINE: 'airline',
  SORT: 'sort',
};

export const SORT_OPTIONS = {
  CHEAPEST: 'cheapest',
  FASTEST: 'fastest',
};
