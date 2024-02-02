import { defineStore } from 'pinia';
import { ref, computed, toValue } from 'vue';
import CookieAuthService, { AuthService } from '@/services/auth-service';
import { getFromLocalStorage, saveToLocalStorage } from '@/utils';

export interface User {
  username: string;
}

type Credentials = {
  email: string;
  password: string;
};

const authStoreSetup = (authService: AuthService) => {
  const _user = ref<User | null>(getFromLocalStorage<User>('user'));

  const user = computed(() => _user.value);
  const isAuthenticated = computed(() => !!_user.value);

  const login = async (credentials: Credentials) => {
    return authService.login(credentials.email, credentials.password).then((response) => {
      setAuthUser(response.data);
    });
  };

  const register = async (credentials: Credentials) => {
    return authService.register(credentials.email, credentials.password);
  };

  const logout = async () => {
    return authService.logout().then(() => {
      setAuthUser(null);
    });
  };

  const checkAuth = async () => {
    return authService.currentUser().then((response) => {
      setAuthUser(response.data);
    });
  };

  const setAuthUser = (user: User | null) => {
    _user.value = user;
    if (!user) {
      localStorage.removeItem('user');
    } else {
      saveToLocalStorage('user', toValue(_user));
    }
  };

  return {
    user,
    login,
    logout,
    register,
    isAuthenticated,
    checkAuth
  };
};

export const useAuthStore = defineStore('auth', () => authStoreSetup(new CookieAuthService()));
