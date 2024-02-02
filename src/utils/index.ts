import type { PomodoroModeValue } from '@/stores/timer-setting';

export const getFromLocalStorage = <T>(key: string) => {
  const item = localStorage.getItem(key);
  if (!item) return null;
  return JSON.parse(item) as T;
};

export const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const setHTMLTitle = (title: string) => {
  document.title = title;
};

export const setDataMode = (mode: PomodoroModeValue) => {
  document.body.setAttribute('data-mode', mode);
};
