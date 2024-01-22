import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';

import PomodoroTimer from '../PomodoroTimer.vue';

describe('PomodoroTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should render properly', async () => {
    const wrapper = mount(PomodoroTimer, {
      props: {
        minutes: 25
      }
    });

    expect(wrapper.find('.time').text()).toContain('25:00');

    expect(wrapper.find('.btn-toggle-start').text()).toContain('Start');

    await wrapper.setProps({
      minutes: 1
    });

    expect(wrapper.find('.time').text()).toContain('01:00');
  });

  it('should run the timer when "Start" is clicked', async () => {
    const wrapper = mount(PomodoroTimer, {
      props: {
        minutes: 25
      }
    });

    await wrapper.find('.btn-toggle-start').trigger('click');

    vi.advanceTimersByTime(1000);
    await flushPromises();

    expect(wrapper.find('.time').text()).toContain('24:59');

    expect(wrapper.emitted().running[0]).toEqual(['25:00']);
    expect(wrapper.emitted().running[1]).toEqual(['24:59']);
  });

  it('should pause the timer when "Pause" is clicked', async () => {
    const wrapper = mount(PomodoroTimer, {
      props: {
        minutes: 25
      }
    });

    await wrapper.find('.btn-toggle-start').trigger('click');

    vi.advanceTimersByTime(1000);
    await flushPromises();

    expect(wrapper.find('.time').text()).toContain('24:59');

    await wrapper.find('.btn-toggle-start').trigger('click');

    await flushPromises();

    expect(wrapper.emitted().paused[0]).toEqual(['24:59']);
  });

  it('should stop the timer when "Stop" is clicked', async () => {
    const wrapper = mount(PomodoroTimer, {
      props: {
        minutes: 25
      }
    });

    await wrapper.find('.btn-toggle-start').trigger('click');

    vi.advanceTimersByTime(1000);
    await flushPromises();

    expect(wrapper.find('.time').text()).toContain('24:59');

    await wrapper.find('.btn-stop').trigger('click');

    await flushPromises();

    expect(wrapper.emitted().stopped[0]).toEqual(['25:00']);
  });
});
