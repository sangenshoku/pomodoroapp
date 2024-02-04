import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { NOTIFICATION_DEFAULT_TIMEOUT, useToastNotificationStore } from '../toast-notification';

describe('useToastNotificationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useRealTimers().clearAllMocks().useFakeTimers();
  });

  it('should add notification', () => {
    const store = useToastNotificationStore();

    store.addErrorNotification('Test Error');
    store.addInfoNotification('Test Info');
    store.addSuccessNotification('Test Success');

    expect(store.notifications).toHaveLength(3);

    const notifications = Array.from(store.notifications.values());

    [
      ['Test Error', 'error'],
      ['Test Info', 'info'],
      ['Test Success', 'success']
    ].forEach(([message, status], index) => {
      expect(notifications[index].message).toEqual(message);
      expect(notifications[index].status).toEqual(status);
    });
  });

  it('should remove notifications after timeout', () => {
    const store = useToastNotificationStore();

    store.addErrorNotification('Test Error');

    vi.advanceTimersByTime(NOTIFICATION_DEFAULT_TIMEOUT);

    expect(store.notifications).toHaveLength(0);

    store.addInfoNotification('Test Info', 2000);

    vi.advanceTimersByTime(1000);

    expect(store.notifications).toHaveLength(1);

    vi.advanceTimersByTime(1000);

    expect(store.notifications).toHaveLength(0);

    store.addSuccessNotification('Test Success', 3000);

    vi.advanceTimersByTime(2000);

    expect(store.notifications).toHaveLength(1);

    vi.advanceTimersByTime(1000);

    expect(store.notifications).toHaveLength(0);
  });
});
