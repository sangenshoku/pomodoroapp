import axios from '@/http';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CookieAuthService from '../auth-service';

vi.mock('@/http');

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be able to login', async () => {
    const authService = new CookieAuthService();

    vi.mocked(axios, true).post.mockResolvedValue({ data: { username: 'test@test.com' } });

    const response = await authService.login('test@test.com', 'password');

    expect(response.data).toMatchObject({ username: 'test@test.com' });
  });

  it('should be able to logout', async () => {
    const authService = new CookieAuthService();

    vi.mocked(axios, true).post.mockResolvedValue({});

    const response = await authService.logout();

    expect(response).toMatchObject({});
  });

  it('should be able to register', async () => {
    const authService = new CookieAuthService();

    vi.mocked(axios, true).post.mockResolvedValue({});

    const response = await authService.register('test@test.com', 'password');

    expect(response).toMatchObject({});
  });

  it('should be able to get current user', async () => {
    const authService = new CookieAuthService();

    vi.mocked(axios, true).get.mockResolvedValue({ data: { username: 'test@test.com' } });

    const response = await authService.currentUser();

    expect(response.data).toMatchObject({ username: 'test@test.com' });
  });
});
