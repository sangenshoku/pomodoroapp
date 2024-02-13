import { describe, expect, it, vi, beforeAll, afterAll } from 'vitest';

import { ClockTickAudioService, AlarmAudioService } from '../audio-service';

describe('AudioService', () => {
  beforeAll(() => {
    Object.assign(HTMLAudioElement.prototype, {
      play: vi.fn(function () {
        return Promise.resolve();
      }),
      pause: vi.fn()
    });
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  describe('ClockTickAudioService', () => {
    it('should create an instance of ClockTickAudioService', () => {
      const audioService = new ClockTickAudioService({ audio: 'clockTick', loop: false });
      expect(audioService).toBeInstanceOf(ClockTickAudioService);
    });

    it('should play the audio', async () => {
      const audioService = new ClockTickAudioService({ audio: 'clockTick', loop: false });
      vi.spyOn(audioService, 'play');
      await audioService.play();
      expect(audioService.play).toHaveBeenCalled();
    });

    it('should pause the audio', () => {
      const audioService = new ClockTickAudioService({ audio: 'clockTick', loop: false });
      vi.spyOn(audioService, 'pause');
      audioService.pause();
      expect(audioService.pause).toHaveBeenCalled();
    });

    it('should stop the audio', () => {
      const audioService = new ClockTickAudioService({ audio: 'clockTick', loop: false });
      vi.spyOn(audioService, 'stop');
      audioService.stop();
      expect(audioService.stop).toHaveBeenCalled();
    });
  });

  describe('AlarmAudioService', () => {
    it('should create an instance of AlarmAudioService', () => {
      const audioService = new AlarmAudioService({ audio: 'bell', loop: false });
      expect(audioService).toBeInstanceOf(AlarmAudioService);
    });

    it('should play the audio', async () => {
      const audioService = new AlarmAudioService({ audio: 'bell', loop: false });
      vi.spyOn(audioService, 'play');
      await audioService.play();
      expect(audioService.play).toHaveBeenCalled();
    });

    it('should pause the audio', () => {
      const audioService = new AlarmAudioService({ audio: 'bell', loop: false });
      vi.spyOn(audioService, 'pause');
      audioService.pause();
      expect(audioService.pause).toHaveBeenCalled();
    });

    it('should stop the audio', () => {
      const audioService = new AlarmAudioService({ audio: 'bell', loop: false });
      vi.spyOn(audioService, 'stop');
      audioService.stop();
      expect(audioService.stop).toHaveBeenCalled();
    });
  });
});
