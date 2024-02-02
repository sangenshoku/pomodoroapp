import axios from '@/http';
import { type AxiosResponse } from 'axios';

interface CurrentAuthUser {
  username: string;
}

const AUTH_ENDPOINT = '/auth';

/* eslint-disable @typescript-eslint/no-unused-vars */
export class AuthService {
  login(email: string, password: string): Promise<AxiosResponse<CurrentAuthUser>> {
    throw new Error('Method not implemented.');
  }

  logout(): Promise<AxiosResponse> {
    throw new Error('Method not implemented.');
  }

  register(email: string, password: string): Promise<AxiosResponse> {
    throw new Error('Method not implemented.');
  }

  currentUser(): Promise<AxiosResponse<CurrentAuthUser>> {
    throw new Error('Method not implemented.');
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export default class CookieAuthService extends AuthService {
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
