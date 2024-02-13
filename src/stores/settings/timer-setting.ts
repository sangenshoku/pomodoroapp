import { shallowReactive, shallowRef, watch, shallowReadonly } from 'vue';
import { defineStore } from 'pinia';
import { getFromLocalStorage } from '@/utils';

export interface PomodoroTimeSetting {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
}

export type PomodoroModeValue = keyof Omit<PomodoroTimeSetting, 'longBreakInterval'>;

export const POMODORO_TIMER_LOCAL_STORAGE_KEY = 'pomodoroTimerSetting';

export const DEFAULT_TIME_SETTING: PomodoroTimeSetting = Object.freeze({
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4
});

export const usePomodoroTimerSettingStore = defineStore('pomodoro-timer-setting', () => {
  const _timeSetting = shallowReactive<PomodoroTimeSetting>(
    getFromLocalStorage<PomodoroTimeSetting>(POMODORO_TIMER_LOCAL_STORAGE_KEY) ?? {
      ...DEFAULT_TIME_SETTING
    }
  );
  const _currentMode = shallowRef<PomodoroModeValue>('pomodoro');

  const currentMode = shallowReadonly(_currentMode);
  const timeSetting = shallowReadonly(_timeSetting);

  watch(_timeSetting, (newTimeSetting) => {
    localStorage.setItem(POMODORO_TIMER_LOCAL_STORAGE_KEY, JSON.stringify(newTimeSetting));
  });

  const setTimeSetting = (settings: Partial<PomodoroTimeSetting>) => {
    for (const [key, value] of Object.entries(settings)) {
      if (!(key in _timeSetting)) continue;
      if (typeof value !== 'number') continue;
      if (key === 'longBreakInterval' && value < 1) {
        settings[key] = 1;
      } else if (value < 0) {
        settings[key as PomodoroModeValue] = 0;
      } else if (value > 60) {
        settings[key as PomodoroModeValue] = 60;
      }
    }
    Object.assign(_timeSetting, settings);
  };

  const setMode = (mode: PomodoroModeValue) => {
    _currentMode.value = mode;
  };

  const isMode = (mode: PomodoroModeValue) => {
    return _currentMode.value === mode;
  };

  const getTimeSetting = (mode: PomodoroModeValue) => {
    return _timeSetting[mode];
  };

  const reset = () => {
    setTimeSetting(DEFAULT_TIME_SETTING);
  };

  return {
    timeSetting,
    setTimeSetting,
    reset,
    getTimeSetting,
    setMode,
    currentMode,
    isMode
  };
});
