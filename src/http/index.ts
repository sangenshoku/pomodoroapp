import _axios, { AxiosError, isAxiosError } from 'axios';

interface HttpErrorBase<T> {
  error: Error | AxiosError<T>;
  type: 'error' | 'axios-error';
}

interface HttpAxiosError<T> extends HttpErrorBase<T> {
  type: 'axios-error';
  error: AxiosError<T>;
}

interface HttpError<T> extends HttpErrorBase<T> {
  type: 'error';
  error: Error;
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

const BASE_URL =
  import.meta.env.VITE_API_SERVER_URL ||
  import.meta.env.VITE_VERCEL_SERVER_URL ||
  'http://localhost:5174';

const axios = _axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true
});

export const axiosErrorHandler = <T>(callback: (err: HttpError<T> | HttpAxiosError<T>) => void) => {
  return (error: Error | AxiosError<T>) => {
    if (isAxiosError(error)) {
      callback({ type: 'axios-error', error });
    } else {
      callback({ type: 'error', error });
    }
  };
};

export const authInterceptor = axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (isAxiosError(error) && error.response?.status === HttpStatus.UNAUTHORIZED) {
      localStorage.removeItem('user');
    }

    return Promise.reject(error);
  }
);

export default axios;
