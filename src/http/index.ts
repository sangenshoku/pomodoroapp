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

const axios = _axios.create({
  baseURL: 'http://localhost:5174/api',
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
    return Promise.reject(error);
  }
);

export default axios;
