import { setActivePinia, createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Toaster from '../Toaster.vue';
import { useToastNotificationStore } from '../../stores/toast-notification';

describe('Toaster', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const el = document.createElement('div');
    el.id = 'app';
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.outerHTML = '';
  });

  it('should render properly', () => {
    mount(Toaster);
    expect(document.querySelector('#app > [data-testid="toaster"]')).not.toBeNull();
  });

  it('should render info notification', async () => {
    const store = useToastNotificationStore();

    mount(Toaster);

    store.addInfoNotification('Test Toast 1');
    store.addInfoNotification('Test Toast 2');

    Array.from(document.querySelectorAll('.toast > .alert')).forEach((toast, index) => {
      expect(toast.classList).toContain('alert-info');
      expect(toast.textContent).toContain(`Test Toast ${index + 1}`);
    });
  });

  it('should render success notification', async () => {
    const store = useToastNotificationStore();

    mount(Toaster);

    store.addSuccessNotification('Test Toast 1');
    store.addSuccessNotification('Test Toast 2');

    Array.from(document.querySelectorAll('.toast > .alert')).forEach((toast, index) => {
      expect(toast.classList).toContain('alert-success');
      expect(toast.textContent).toContain(`Test Toast ${index + 1}`);
    });
  });

  it('should render error notification', async () => {
    const store = useToastNotificationStore();

    mount(Toaster);

    store.addErrorNotification('Test Toast 1');
    store.addErrorNotification('Test Toast 2');

    Array.from(document.querySelectorAll('.toast > .alert')).forEach((toast, index) => {
      expect(toast.classList).toContain('alert-danger');
      expect(toast.textContent).toContain(`Test Toast ${index + 1}`);
    });
  });
});
