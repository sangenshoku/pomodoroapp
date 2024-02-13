import { describe, it, expect, beforeEach } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { AUDIO_SETTING_LOCAL_STORAGE_KEY, usePomodoroAudioSettingStore } from '../audio-setting';
import { getFromLocalStorage } from '@/utils';

describe('usePomodoroAudioSettingStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
    setActivePinia(createPinia());
  });

  it('should be able to return default sound setting', () => {
    const { soundSetting } = usePomodoroAudioSettingStore();

    expect(soundSetting).toMatchObject({ tick: null, alarm: 'bell' });
  });

  it('should be able to set tick sound setting', async () => {
    const { setTick, soundSetting } = usePomodoroAudioSettingStore();

    setTick('clockTick');

    expect(soundSetting).toMatchObject({ tick: 'clockTick', alarm: 'bell' });

    await flushPromises();

    expect(getFromLocalStorage(AUDIO_SETTING_LOCAL_STORAGE_KEY)).toMatchObject({
      tick: 'clockTick',
      alarm: 'bell'
    });
  });

  it('should be able to set alarm sound setting', async () => {
    const { setAlarm, soundSetting } = usePomodoroAudioSettingStore();

    setAlarm('digital1');

    expect(soundSetting).toMatchObject({ tick: null, alarm: 'digital1' });

    await flushPromises();

    expect(getFromLocalStorage(AUDIO_SETTING_LOCAL_STORAGE_KEY)).toMatchObject({
      tick: null,
      alarm: 'digital1'
    });
  });

  it('should be able to set both tick and alarm sound setting', async () => {
    const { setTick, setAlarm, soundSetting } = usePomodoroAudioSettingStore();

    setTick('clockTick');
    setAlarm('digital1');

    expect(soundSetting).toMatchObject({ tick: 'clockTick', alarm: 'digital1' });

    await flushPromises();

    expect(getFromLocalStorage(AUDIO_SETTING_LOCAL_STORAGE_KEY)).toMatchObject({
      tick: 'clockTick',
      alarm: 'digital1'
    });
  });
});
