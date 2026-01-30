import axios, { InternalAxiosRequestConfig } from 'axios';
import { AMADEUS_CONFIG } from '../constants';
import { authService } from './auth.service';

/**
 * Centralized Axios instance for Amadeus API.
 * Automatically handles Bearer token injection and 401 token refresh.
 */
const amadeusClient = axios.create({
  baseURL: AMADEUS_CONFIG.BASE_URL,
});

/**
 * Request interceptor to attach Authorization header.
 */
amadeusClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await authService.getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle token expiration (401).
 * Will attempt to clear the cached token, fetch a new one, and retry the request once.
 */
amadeusClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      authService.clearToken();
      
      try {
        const newToken = await authService.getAccessToken();
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return amadeusClient(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default amadeusClient;
