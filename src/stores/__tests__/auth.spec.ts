import axios from '@/http';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../auth';
import { flushPromises } from '@vue/test-utils';

vi.mock('@/http');

const TEST_CREDENTIALS = {
  email: 'test@test.com',
  password: 'password'
};

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

    await authStore.register(TEST_CREDENTIALS);

    expect(authStore.register).toHaveBeenCalledWith(TEST_CREDENTIALS);
  });

  it('should be able to login', async () => {
    const authStore = useAuthStore();

    vi.mocked(axios, true).post.mockResolvedValue({ data: { username: 'test@test.com' } });

    vi.spyOn(authStore, 'login');

    await authStore.login(TEST_CREDENTIALS);

    expect(authStore.login).toHaveBeenCalledWith(TEST_CREDENTIALS);
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

  describe('loading', () => {
    it('should update the `register` loading status', async () => {
      const authStore = useAuthStore();

      vi.mocked(axios, true).post.mockResolvedValueOnce({}).mockRejectedValue('');

      try {
        authStore.register(TEST_CREDENTIALS);

        expect(authStore.isLoading('register')).toBe(true);

        await flushPromises();

        await authStore.register(TEST_CREDENTIALS);
      } catch (e) {
        // empty
      } finally {
        expect(authStore.isLoading('register')).toBe(false);
      }
    });

    it('should update the `login` loading status', async () => {
      const authStore = useAuthStore();

      vi.mocked(axios, true).post.mockResolvedValueOnce({}).mockRejectedValue('');

      try {
        authStore.login(TEST_CREDENTIALS);

        expect(authStore.isLoading('login')).toBe(true);

        await flushPromises();

        await authStore.login(TEST_CREDENTIALS);
      } catch (e) {
        // empty
      } finally {
        expect(authStore.isLoading('login')).toBe(false);
      }
    });

    it('should update the `logout` loading status', async () => {
      const authStore = useAuthStore();

      vi.mocked(axios, true).post.mockResolvedValueOnce({}).mockRejectedValue('');

      try {
        authStore.logout();

        expect(authStore.isLoading('logout')).toBe(true);

        await flushPromises();

        await authStore.logout();
      } catch (e) {
        // empty
      } finally {
        expect(authStore.isLoading('logout')).toBe(false);
      }
    });
  });
});
