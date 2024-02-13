import clockTickSrc from '@/assets/audios/clock_tick.m4a';
import bellSrc from '@/assets/audios/ding.m4a';
import digital1Src from '@/assets/audios/digital_alarm_1.m4a';

export type ClockTick = 'clockTick';
export type Alarm = 'bell' | 'digital1';

export type AudioSrc = ClockTick | Alarm;

interface AudioOptions {
  audio: AudioSrc;
  loop?: boolean;
}

interface ClockTickAudioOptions {
  audio: ClockTick;
  loop: boolean;
}

interface AlarmAudioOptions {
  audio: Alarm;
  loop: boolean;
}

export abstract class AudioService {
  protected audio: HTMLAudioElement;

  constructor(options: AudioOptions) {
    this.audio = new Audio(options.audio);
    this.audio.loop = options.loop || false;
  }

  async play() {
    await this.audio.play();
  }

  pause() {
    return this.audio.pause();
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }
}

export class ClockTickAudioService extends AudioService {
  constructor(options: ClockTickAudioOptions) {
    let audioSrc = clockTickSrc;

    switch (options.audio) {
      case 'clockTick':
        audioSrc = clockTickSrc;
        break;
      default:
        throw new Error('Invalid clock tick audio');
    }

    super({ audio: audioSrc, loop: options.loop });
  }
}

export class AlarmAudioService extends AudioService {
  constructor(options: AlarmAudioOptions) {
    let audioSrc = bellSrc;

    switch (options.audio) {
      case 'bell':
        audioSrc = bellSrc;
        break;
      case 'digital1':
        audioSrc = digital1Src;
        break;
      default:
        throw new Error('Invalid alarm audio');
    }

    super({ audio: audioSrc, loop: options.loop });
  }
}

export const clockTickAudio = new ClockTickAudioService({ audio: 'clockTick', loop: true });
export const digital1Audio = new AlarmAudioService({ audio: 'digital1', loop: false });
export const bellAudio = new AlarmAudioService({ audio: 'bell', loop: false });
