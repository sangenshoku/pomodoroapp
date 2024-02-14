import axios from '@/http';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CookieAuthService from '../auth-service';

vi.mock('@/http');

const TEST_LOGIN_REQUEST = {
  email: 'test@test.com',
  password: 'password'
};

const TEST_REGISTER_REQUEST = {
  ...TEST_LOGIN_REQUEST,
  confirmPassword: 'password'
};

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be able to login', async () => {
    const authService = new CookieAuthService();

    vi.mocked(axios, true).post.mockResolvedValue({ data: { username: 'test@test.com' } });
    vi.spyOn(authService, 'login');

    const response = await authService.login(TEST_LOGIN_REQUEST);

    expect(authService.login).toHaveBeenCalledWith(TEST_LOGIN_REQUEST);
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
    vi.spyOn(authService, 'register');

    const response = await authService.register(TEST_REGISTER_REQUEST);

    expect(authService.register).toHaveBeenCalledWith(TEST_REGISTER_REQUEST);
    expect(response).toMatchObject({});
  });

  it('should be able to get current user', async () => {
    const authService = new CookieAuthService();

    vi.mocked(axios, true).get.mockResolvedValue({ data: { username: 'test@test.com' } });

    const response = await authService.currentUser();

    expect(response.data).toMatchObject({ username: 'test@test.com' });
  });
});
