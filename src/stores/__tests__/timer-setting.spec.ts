import { beforeEach, describe, it, expect } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import { usePomodoroTimerSettingStore } from '../timer-setting';

describe('usePomodoroTimerSettingStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
    setActivePinia(createPinia());
  });

  describe('time setting', () => {
    it('should be able to set time setting', () => {
      const { setTimeSetting, timeSetting } = usePomodoroTimerSettingStore();

      setTimeSetting({ pomodoro: 30 });

      expect(timeSetting).toMatchObject({ pomodoro: 30, shortBreak: 5, longBreak: 15 });

      setTimeSetting({ shortBreak: 10 });

      expect(timeSetting).toMatchObject({ pomodoro: 30, shortBreak: 10, longBreak: 15 });

      setTimeSetting({ longBreak: 20 });

      expect(timeSetting).toMatchObject({ pomodoro: 30, shortBreak: 10, longBreak: 20 });
    });

    it('should not be able to set time setting with negative value', () => {
      const { setTimeSetting, timeSetting } = usePomodoroTimerSettingStore();

      setTimeSetting({ pomodoro: -1 });

      expect(timeSetting).toMatchObject({ pomodoro: 0, shortBreak: 5, longBreak: 15 });

      setTimeSetting({ shortBreak: -1 });

      expect(timeSetting).toMatchObject({ pomodoro: 0, shortBreak: 0, longBreak: 15 });

      setTimeSetting({ longBreak: -1 });

      expect(timeSetting).toMatchObject({ pomodoro: 0, shortBreak: 0, longBreak: 0 });
    });

    it('should be able to reset time setting', () => {
      const { setTimeSetting, reset, timeSetting } = usePomodoroTimerSettingStore();

      setTimeSetting({ pomodoro: 30, shortBreak: 10, longBreak: 20 });

      expect(timeSetting).toMatchObject({ pomodoro: 30, shortBreak: 10, longBreak: 20 });

      reset();

      expect(timeSetting).toMatchObject({ pomodoro: 25, shortBreak: 5, longBreak: 15 });
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
