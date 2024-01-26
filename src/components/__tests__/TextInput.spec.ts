import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import TextInput from '../TextInput.vue';

describe('TextInput', () => {
  it('should render properly', () => {
    const wrapper = mount(TextInput);

    expect(wrapper.find('input[data-testid="text-input"]').isVisible()).toBe(true);
  });

  describe('model', () => {
    it('should emit an input event', async () => {
      const wrapper = mount(TextInput);

      await wrapper.find('input[data-testid="text-input"]').setValue('Test');

      expect(wrapper.emitted('update:modelValue')).toEqual([['Test']]);
    });
  });

  describe('props', () => {
    it('should render with a placeholder', () => {
      const wrapper = mount(TextInput, {
        props: {
          placeholder: 'Test placeholder'
        }
      });

      expect(wrapper.find('input[data-testid="text-input"]').attributes('placeholder')).toBe(
        'Test placeholder'
      );
      expect(wrapper.html()).toContain('Test placeholder');
    });

    it('should render with different sizes', async () => {
      const wrapper = mount(TextInput, {
        props: {
          size: 'small'
        }
      });

      expect(wrapper.find('input[data-testid="text-input"]').classes()).toContain('input-sm');

      await wrapper.setProps({ size: 'large' });

      expect(wrapper.find('input[data-testid="text-input"]').classes()).toContain('input-lg');

      await wrapper.setProps({ size: 'extra-small' });

      expect(wrapper.find('input[data-testid="text-input"]').classes()).toContain('input-xs');
    });

    it('should render with different colors', async () => {
      const wrapper = mount(TextInput, {
        props: {
          color: 'primary'
        }
      });

      expect(wrapper.find('input[data-testid="text-input"]').classes()).toContain('input-primary');

      for (const color of ['secondary', 'accent', 'info', 'success', 'warning', 'error']) {
        await wrapper.setProps({ color: color as any });

        expect(wrapper.find('input[data-testid="text-input"]').classes()).toContain(
          `input-${color}`
        );
      }
    });

    it('should render as bordered', async () => {
      const wrapper = mount(TextInput, {
        props: {
          bordered: true
        }
      });

      expect(wrapper.find('input[data-testid="text-input"]').classes()).toContain('input-bordered');
    });

    it('should render as ghost', async () => {
      const wrapper = mount(TextInput, {
        props: {
          ghost: true
        }
      });

      expect(wrapper.find('input[data-testid="text-input"]').classes()).toContain('input-ghost');
    });
  });
});
