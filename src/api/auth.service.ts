import axios from 'axios';
import { AMADEUS_CONFIG } from '../constants';

/**
 * Service to handle Amadeus OAuth2 Authentication
 */
class AuthService {
  private token: string | null = null;
  private expiryTime: number | null = null;

  /**
   * Fetches a new access token from Amadeus
   */
  async getAccessToken(): Promise<string | null> {
    // Return cached token if still valid
    if (this.token && this.expiryTime && Date.now() < this.expiryTime) {
      return this.token;
    }

    try {
      const response = await axios.post(
        `${AMADEUS_CONFIG.BASE_URL}${AMADEUS_CONFIG.AUTH_ENDPOINT}`,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: import.meta.env.VITE_AMADEUS_API_KEY,
          client_secret: import.meta.env.VITE_AMADEUS_API_SECRET,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const { access_token, expires_in } = response.data;
      
      this.token = access_token;
      // Subtract 5 minutes buffer
      this.expiryTime = Date.now() + (expires_in - 300) * 1000;

      return this.token;
    } catch (error) {
      console.error('Failed to fetch Amadeus access token:', error);
      throw error;
    }
  }

  /**
   * Clears the current token (force refresh)
   */
  clearToken(): void {
    this.token = null;
    this.expiryTime = null;
  }
}

export const authService = new AuthService();
