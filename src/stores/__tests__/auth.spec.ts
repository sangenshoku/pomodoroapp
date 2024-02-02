import axios from '@/http';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../auth';

vi.mock('@/http');

describe('AuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    setActivePinia(createPinia());
  });

  it('should be able to register', async () => {
    const authStore = useAuthStore();

    vi.mocked(axios, true).post.mockResolvedValue({});

    vi.spyOn(authStore, 'register');

    const credentials = {
      email: 'test@test.com',
      password: 'password'
    };

    await authStore.register(credentials);

    expect(authStore.register).toHaveBeenCalledWith(credentials);
  });

  it('should be able to login', async () => {
    const authStore = useAuthStore();

    vi.mocked(axios, true).post.mockResolvedValue({ data: { username: 'test@test.com' } });

    vi.spyOn(authStore, 'login');

    const credentials = {
      email: 'test@test.com',
      password: 'password'
    };

    await authStore.login(credentials);

    expect(authStore.login).toHaveBeenCalledWith(credentials);
    expect(authStore.user).toMatchObject({ username: 'test@test.com' });
    expect(authStore.isAuthenticated).toBe(true);
  });

  it('should be able to logout', async () => {
    const authStore = useAuthStore();

    vi.mocked(axios, true).post.mockResolvedValue({});

    await authStore.logout();

    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.user).toBe(null);
  });

  it('should be able to check current user', async () => {
    const authStore = useAuthStore();

    vi.mocked(axios, true).get.mockResolvedValue({ data: { username: 'test@test.com' } });

    await authStore.checkAuth();

    expect(authStore.user).toMatchObject({ username: 'test@test.com' });
    expect(authStore.isAuthenticated).toBe(true);
  });
});
