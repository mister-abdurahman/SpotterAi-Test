import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { authService } from '../api/auth.service';

vi.mock('axios');

describe('AuthService', () => {
  beforeEach(() => {
    authService.clearToken();
    vi.clearAllMocks();
  });

  it('should fetch a new token if none exists', async () => {
    const mockToken = 'test-token';
    vi.mocked(axios.post).mockResolvedValueOnce({
      data: { access_token: mockToken, expires_in: 1800 }
    });

    const token = await authService.getAccessToken();
    expect(token).toBe(mockToken);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it('should return cached token if not expired', async () => {
    const mockToken = 'cached-token';
    vi.mocked(axios.post).mockResolvedValueOnce({
      data: { access_token: mockToken, expires_in: 1800 }
    });

    await authService.getAccessToken();
    const token = await authService.getAccessToken();
    
    expect(token).toBe(mockToken);
    expect(axios.post).toHaveBeenCalledTimes(1); // Only called once
  });
});
