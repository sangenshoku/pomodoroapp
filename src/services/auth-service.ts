import axios from '@/http';
import { type AxiosResponse } from 'axios';

interface CurrentAuthUser {
  username: string;
}

const AUTH_ENDPOINT = '/auth';

export interface AuthService {
  login(email: string, password: string): Promise<AxiosResponse<CurrentAuthUser>>;
  logout(): Promise<AxiosResponse>;
  register(email: string, password: string): Promise<AxiosResponse>;
  currentUser(): Promise<AxiosResponse<CurrentAuthUser>>;
}

export default class CookieAuthService implements AuthService {
  async login(email: string, password: string) {
    return await axios.post<CurrentAuthUser>(`${AUTH_ENDPOINT}/login`, {
      email,
      password
    });
  }

  async logout() {
    return await axios.post(`${AUTH_ENDPOINT}/logout`);
  }

  async register(email: string, password: string) {
    return await axios.post(`${AUTH_ENDPOINT}/register`, {
      email,
      password
    });
  }

  async currentUser() {
    return await axios.get<CurrentAuthUser>(`${AUTH_ENDPOINT}/me`);
  }
}
