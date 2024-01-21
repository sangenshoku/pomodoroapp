import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { useTimer } from '../timer';
import { toRef } from 'vue';

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should start the timer', async () => {
    const { startTimer, time, status } = useTimer(toRef(1));

    startTimer();

    expect(status.value).toEqual('running');

    vi.advanceTimersByTime(1000);

    expect(time.value).toMatchObject({
      total: 59,
      minutes: 0,
      seconds: 59
    });

    vi.advanceTimersByTime(29000);

    expect(time.value).toMatchObject({
      total: 30,
      minutes: 0,
      seconds: 30
    });

    vi.advanceTimersByTime(30000);

    expect(time.value).toMatchObject({
      total: 0,
      minutes: 0,
      seconds: 0
    });

    await flushPromises();

    expect(status.value).toEqual('stopped');
  });

  it('should pause the timer', async () => {
    const { startTimer, pauseTimer, time, status } = useTimer(toRef(1));

    startTimer(1);

    expect(status.value).toEqual('running');

    vi.advanceTimersByTime(1000);

    expect(time.value).toMatchObject({
      total: 59,
      minutes: 0,
      seconds: 59
    });

    await pauseTimer();

    expect(status.value).toEqual('paused');

    vi.advanceTimersByTime(1000);

    expect(time.value).toMatchObject({
      total: 59,
      minutes: 0,
      seconds: 59
    });
  });

  it('should resume the timer', async () => {
    const { startTimer, pauseTimer, resumeTimer, time, status } = useTimer(toRef(2));

    startTimer();

    expect(status.value).toEqual('running');

    vi.advanceTimersByTime(1000);

    expect(time.value).toMatchObject({
      total: 119,
      minutes: 1,
      seconds: 59
    });

    await pauseTimer();

    expect(status.value).toEqual('paused');

    vi.advanceTimersByTime(1000);

    expect(time.value).toMatchObject({
      total: 119,
      minutes: 1,
      seconds: 59
    });

    await resumeTimer();

    expect(status.value).toEqual('running');

    vi.advanceTimersByTime(1000);

    expect(time.value).toMatchObject({
      total: 118,
      minutes: 1,
      seconds: 58
    });
  });

  it('should stop the timer', async () => {
    const { startTimer, stopTimer, time, status } = useTimer(toRef(1));

    startTimer();

    expect(status.value).toEqual('running');

    vi.advanceTimersByTime(1000);

    expect(time.value).toMatchObject({
      total: 59,
      minutes: 0,
      seconds: 59
    });

    await stopTimer();

    expect(status.value).toEqual('stopped');

    expect(time.value).toMatchObject({
      total: 60,
      minutes: 1,
      seconds: 0
    });
  });
});
