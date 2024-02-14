import { defineStore } from 'pinia';
import { ref, computed, toValue, shallowReactive } from 'vue';
import CookieAuthService, {
  type AuthService,
  type LoginRequest,
  type RegisterRequest
} from '@/services/auth-service';
import { getFromLocalStorage, saveToLocalStorage } from '@/utils';

export interface User {
  username: string;
}

interface AuthLoading {
  login: boolean;
  register: boolean;
  logout: boolean;
}

type AuthLoadingKey = keyof AuthLoading;

const authStoreSetup = (authService: AuthService) => {
  const _user = ref<User | null>(getFromLocalStorage<User>('user'));
  const _loading = shallowReactive<AuthLoading>({
    login: false,
    register: false,
    logout: false
  });

  const user = computed(() => _user.value);
  const isAuthenticated = computed(() => !!_user.value);

  const login = async (request: LoginRequest) => {
    setLoading('login', true);
    return authService
      .login(request)
      .then((response) => setAuthUser(response.data))
      .finally(() => setLoading('login', false));
  };

  const register = async (request: RegisterRequest) => {
    setLoading('register', true);
    return authService.register(request).finally(() => setLoading('register', false));
  };

  const logout = async () => {
    setLoading('logout', true);
    return authService
      .logout()
      .then(() => setAuthUser(null))
      .finally(() => setLoading('logout', false));
  };

  const checkAuth = async () => {
    return authService.currentUser().then((response) => setAuthUser(response.data));
  };

  const setAuthUser = (user: User | null) => {
    _user.value = user;
    if (!user) {
      localStorage.removeItem('user');
    } else {
      saveToLocalStorage('user', toValue(_user));
    }
  };

  const setLoading = (key: AuthLoadingKey, loading: boolean) => {
    _loading[key] = loading;
  };

  const isLoading = (key: AuthLoadingKey) => {
    return _loading[key];
  };

  return {
    user,
    login,
    logout,
    register,
    isAuthenticated,
    checkAuth,
    isLoading
  };
};

export const useAuthStore = defineStore('auth', () => authStoreSetup(new CookieAuthService()));
