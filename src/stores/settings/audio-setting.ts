import type { ClockTick, Alarm } from '@/services/audio-service';
import { defineStore } from 'pinia';
import { computed, shallowReactive, shallowReadonly, watch } from 'vue';
import { bellAudio, clockTickAudio, digital1Audio } from '@/services/audio-service';
import { getFromLocalStorage } from '@/utils';

type SoundSetting = {
  tick: ClockTick | null;
  alarm: Alarm | null;
};

export const DEFAULT_SOUND_SETTING = Object.freeze<SoundSetting>({
  tick: null,
  alarm: 'bell'
});

export const AUDIO_SETTING_LOCAL_STORAGE_KEY = 'pomodoroAudioSetting';

export const usePomodoroAudioSettingStore = defineStore('pomodoro-audio-setting', () => {
  const _soundSetting = shallowReactive<SoundSetting>(
    getFromLocalStorage<SoundSetting>('soundSetting') || { ...DEFAULT_SOUND_SETTING }
  );

  const soundSetting = shallowReadonly(_soundSetting);
  const currentClockTickAudio = computed(() => {
    switch (_soundSetting.tick) {
      case 'clockTick':
        return clockTickAudio;
      default:
        return null;
    }
  });
  const currentAlarmAudio = computed(() => {
    switch (_soundSetting.alarm) {
      case 'bell':
        return bellAudio;
      case 'digital1':
        return digital1Audio;
      default:
        return null;
    }
  });

  watch(_soundSetting, (newSoundSetting) => {
    localStorage.setItem(AUDIO_SETTING_LOCAL_STORAGE_KEY, JSON.stringify(newSoundSetting));
  });

  const setTick = (tick: SoundSetting['tick']) => {
    _soundSetting.tick = tick;
  };

  const setAlarm = (alarm: SoundSetting['alarm']) => {
    _soundSetting.alarm = alarm;
  };

  return {
    soundSetting,
    setTick,
    setAlarm,
    currentClockTickAudio,
    currentAlarmAudio
  };
});
