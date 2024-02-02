import {
  computed,
  type Ref,
  toValue,
  watchEffect,
  watch,
  shallowReactive,
  shallowReadonly,
  shallowRef,
  type ShallowReactive
} from 'vue';

export const SECOND_IN_MILLISECONDS = 1000;
export const SECOND = 60;

export enum TimerStatusEnum {
  RUNNING = 'running',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  FINISHED = 'finished'
}

export type MinuteRef = Ref<number>;
export type TimerStatus = `${TimerStatusEnum}`;

interface TimerTime {
  total: number;
  minutes: number;
  seconds: number;
}

export const minutesToMilliseconds = (minutes: number) => {
  return minutes * SECOND * SECOND_IN_MILLISECONDS;
};

export const calculateMinutesDurationTimestamp = (minutes: number) => {
  return Date.parse(Date()) + minutesToMilliseconds(minutes);
};

export const calculateTime = (durationTimestamp: number): TimerTime => {
  const currentTimestamp = Date.parse(Date());
  const differenceBetweenTimestamps = durationTimestamp - currentTimestamp;

  const total = Math.floor(differenceBetweenTimestamps / SECOND_IN_MILLISECONDS);
  const minutes = Math.floor(total / SECOND);
  const seconds = total % SECOND;

  return {
    total,
    minutes,
    seconds
  };
};

const isValidMinutes = (minutes: number) => {
  return minutes >= 0 && minutes <= 60;
};

const calculateMinuteRefDurationTimestamp = (minutesRef: MinuteRef) => {
  if (!isValidMinutes(minutesRef.value)) return;
  return calculateTime(calculateMinutesDurationTimestamp(toValue(minutesRef)));
};

const initializeTime = (time: ShallowReactive<TimerTime>, minutesRef: MinuteRef) => {
  if (!isValidMinutes(minutesRef.value)) return;
  Object.assign(time, calculateMinuteRefDurationTimestamp(minutesRef));
};

export const useTimer = (minutesRef: MinuteRef) => {
  const _time = shallowReactive<TimerTime>({
    total: 0,
    minutes: 0,
    seconds: 0
  });
  const _status = shallowRef<TimerStatus>(TimerStatusEnum.STOPPED);
  const timerInterval = shallowRef<number | null>(null);

  const time = shallowReadonly(_time);
  const status = shallowReadonly(_status);
  const timeFormatted = computed(() => {
    return `${_time.minutes}`.padStart(2, '0') + ':' + `${_time.seconds}`.padStart(2, '0');
  });

  watch(minutesRef, () => {
    stopTimer();
  });

  watchEffect(() => {
    initializeTime(_time, minutesRef);
  });

  const startTimer = async (minutes: number = toValue(minutesRef)) => {
    const duration = calculateMinutesDurationTimestamp(minutes);

    return new Promise<void>((resolve) => {
      setStatus(TimerStatusEnum.RUNNING);
      timerInterval.value = window.setInterval(() => {
        Object.assign(_time, calculateTime(duration));

        if (_time.total <= 0) {
          clearInterval(timerInterval.value!);
          resolve();
        }
      }, SECOND_IN_MILLISECONDS);
    }).then(() => {
      setStatus(TimerStatusEnum.FINISHED);
      initializeTime(_time, minutesRef);
    });
  };

  const resumeTimer = async () => {
    return new Promise<void>((resolve, reject) => {
      if (!isPaused()) reject(`The timer is currently ${status.value}.`);
      const minutesFromCurrentTotal = _time.total / SECOND;
      startTimer(minutesFromCurrentTotal);
      resolve();
    });
  };

  const pauseTimer = async () => {
    return new Promise<void>((resolve) => {
      resetTimerInterval();
      resolve();
    }).then(() => {
      setStatus(TimerStatusEnum.PAUSED);
    });
  };

  const stopTimer = async () => {
    return new Promise<void>((resolve) => {
      resetTimerInterval();
      resolve();
    }).then(() => {
      setStatus(TimerStatusEnum.STOPPED);
      initializeTime(_time, minutesRef);
    });
  };

  const setStatus = (status: TimerStatus) => {
    _status.value = status;
  };

  const isRunning = () => {
    return toValue(_status) === TimerStatusEnum.RUNNING;
  };

  const isPaused = () => {
    return toValue(_status) === TimerStatusEnum.PAUSED;
  };

  const isStopped = () => {
    return toValue(_status) === TimerStatusEnum.STOPPED;
  };

  const isFinished = () => {
    return toValue(_status) === TimerStatusEnum.FINISHED;
  };

  const resetTimerInterval = () => {
    const interval = timerInterval.value;

    if (!interval) return;

    clearInterval(interval);
    timerInterval.value = null;
  };

  return {
    time,
    status,
    timeFormatted,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    isRunning,
    isPaused,
    isStopped,
    isFinished
  };
};
