import axios from '@/http';
import { type AxiosResponse } from 'axios';

interface CurrentAuthUser {
  username: string;
}

const AUTH_ENDPOINT = '/auth';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthService {
  login(request: LoginRequest): Promise<AxiosResponse<CurrentAuthUser>>;
  logout(): Promise<AxiosResponse>;
  register(request: RegisterRequest): Promise<AxiosResponse>;
  currentUser(): Promise<AxiosResponse<CurrentAuthUser>>;
}

export default class CookieAuthService implements AuthService {
  async login(request: LoginRequest) {
    return await axios.post<CurrentAuthUser>(`${AUTH_ENDPOINT}/login`, { ...request });
  }

  async logout() {
    return await axios.post(`${AUTH_ENDPOINT}/logout`);
  }

  async register(request: RegisterRequest) {
    return await axios.post(`${AUTH_ENDPOINT}/register`, { ...request });
  }

  async currentUser() {
    return await axios.get<CurrentAuthUser>(`${AUTH_ENDPOINT}/me`);
  }
}
