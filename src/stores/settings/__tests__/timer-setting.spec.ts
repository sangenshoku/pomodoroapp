import { beforeEach, describe, it, expect } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { flushPromises } from '@vue/test-utils';

import { POMODORO_TIMER_LOCAL_STORAGE_KEY, usePomodoroTimerSettingStore } from '../timer-setting';
import { getFromLocalStorage } from '@/utils';

describe('usePomodoroTimerSettingStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
    setActivePinia(createPinia());
  });

  describe('time setting', () => {
    it('should be able to set time setting', async () => {
      const { setTimeSetting, timeSetting } = usePomodoroTimerSettingStore();

      setTimeSetting({ pomodoro: 30 });

      expect(timeSetting).toMatchObject({ pomodoro: 30, shortBreak: 5, longBreak: 15 });

      setTimeSetting({ shortBreak: 10 });

      expect(timeSetting).toMatchObject({ pomodoro: 30, shortBreak: 10, longBreak: 15 });

      setTimeSetting({ longBreak: 20 });

      expect(timeSetting).toMatchObject({ pomodoro: 30, shortBreak: 10, longBreak: 20 });

      setTimeSetting({ longBreakInterval: 2 });

      expect(timeSetting).toMatchObject({
        pomodoro: 30,
        shortBreak: 10,
        longBreak: 20,
        longBreakInterval: 2
      });

      await flushPromises();

      expect(getFromLocalStorage(POMODORO_TIMER_LOCAL_STORAGE_KEY)).toMatchObject({
        pomodoro: 30,
        shortBreak: 10,
        longBreak: 20,
        longBreakInterval: 2
      });
    });

    it('should not be able to set time setting with negative value', () => {
      const { setTimeSetting, timeSetting } = usePomodoroTimerSettingStore();

      setTimeSetting({ pomodoro: -1 });

      expect(timeSetting).toMatchObject({ pomodoro: 0, shortBreak: 5, longBreak: 15 });

      setTimeSetting({ shortBreak: -1 });

      expect(timeSetting).toMatchObject({ pomodoro: 0, shortBreak: 0, longBreak: 15 });

      setTimeSetting({ longBreak: -1 });

      expect(timeSetting).toMatchObject({ pomodoro: 0, shortBreak: 0, longBreak: 0 });

      setTimeSetting({ longBreakInterval: 0 });

      expect(timeSetting).toMatchObject({
        pomodoro: 0,
        shortBreak: 0,
        longBreak: 0,
        longBreakInterval: 1
      });
    });

    it('should be able to reset time setting', async () => {
      const { setTimeSetting, reset, timeSetting } = usePomodoroTimerSettingStore();

      setTimeSetting({ pomodoro: 30, shortBreak: 10, longBreak: 20 });

      expect(timeSetting).toMatchObject({ pomodoro: 30, shortBreak: 10, longBreak: 20 });

      reset();

      expect(timeSetting).toMatchObject({ pomodoro: 25, shortBreak: 5, longBreak: 15 });

      await flushPromises();

      expect(getFromLocalStorage(POMODORO_TIMER_LOCAL_STORAGE_KEY)).toMatchObject({
        pomodoro: 25,
        shortBreak: 5,
        longBreak: 15
      });
    });
  });

  describe('mode', () => {
    it('should be able to set mode', () => {
      const store = usePomodoroTimerSettingStore();

      store.setMode('shortBreak');

      expect(store.currentMode).toEqual('shortBreak');

      store.setMode('longBreak');

      expect(store.currentMode).toEqual('longBreak');

      store.setMode('pomodoro');

      expect(store.currentMode).toEqual('pomodoro');
    });
  });
});
