import { defineStore } from 'pinia';
import { ref, shallowReadonly } from 'vue';

export interface Notification {
  status: 'info' | 'error' | 'success';
  message: string;
  id: symbol;
  timeout?: number;
}

export const NOTIFICATION_DEFAULT_TIMEOUT = 1000;

export const useToastNotificationStore = defineStore('toast-notification', () => {
  const _notifications = ref<Map<symbol, Notification>>(new Map());
  const notifications = shallowReadonly(_notifications);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Symbol(Math.round(Math.random() * 1000));

    _notifications.value.set(id, { id, ...notification });

    setTimeout(() => {
      _notifications.value.delete(id);
    }, notification.timeout ?? NOTIFICATION_DEFAULT_TIMEOUT);
  };

  const addInfoNotification = (message: string, timeout = NOTIFICATION_DEFAULT_TIMEOUT) => {
    addNotification({
      message,
      status: 'info',
      timeout
    });
  };

  const addSuccessNotification = (message: string, timeout = NOTIFICATION_DEFAULT_TIMEOUT) => {
    addNotification({
      message,
      status: 'success',
      timeout
    });
  };

  const addErrorNotification = (message: string, timeout = NOTIFICATION_DEFAULT_TIMEOUT) => {
    addNotification({
      message,
      status: 'error',
      timeout
    });
  };

  return {
    notifications,
    addNotification,
    addSuccessNotification,
    addErrorNotification,
    addInfoNotification
  };
});
