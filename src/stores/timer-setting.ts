import { computed, reactive, watch } from 'vue';
import { defineStore } from 'pinia';
import { getFromLocalStorage } from '@/utils';

export interface PomodoroTimeSetting {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
}

export type PomodoroModeValue = keyof PomodoroTimeSetting;

export const LOCAL_STORAGE_KEY = 'pomodoroTimerSetting';

export const DEFAULT_TIME_SETTING: PomodoroTimeSetting = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15
};

export const usePomodoroTimerSettingStore = defineStore('pomodoro-timer-setting', () => {
  const _timeSetting = reactive<PomodoroTimeSetting>(
    getFromLocalStorage<PomodoroTimeSetting>(LOCAL_STORAGE_KEY) ?? DEFAULT_TIME_SETTING
  );

  const timeSetting = computed(() => _timeSetting);

  watch(_timeSetting, (newTimeSetting) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTimeSetting));
  });

  const setTimeSetting = (settings: Partial<PomodoroTimeSetting>) => {
    for (const [key, value] of Object.entries(settings)) {
      if (!(key in _timeSetting)) continue;
      if (typeof value !== 'number') continue;
      if (value < 0) {
        settings[key as PomodoroModeValue] = 0;
      }
    }
    Object.assign(_timeSetting, settings);
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
    getTimeSetting
  };
});
