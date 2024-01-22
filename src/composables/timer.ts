import { ref, computed, type Ref, toValue, watchEffect, watch } from 'vue';

export const SECOND_IN_MILLISECONDS = 1000;
export const SECOND = 60;

export type MinuteRef = Ref<number>;

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

const initializeTime = (time: Ref<TimerTime>, minutesRef: MinuteRef) => {
  if (!isValidMinutes(minutesRef.value)) return;
  Object.assign(time.value, calculateMinuteRefDurationTimestamp(minutesRef));
};

export const useTimer = (minutesRef: MinuteRef) => {
  const _time = ref<TimerTime>({
    total: 0,
    minutes: 0,
    seconds: 0
  });
  const status = ref<'running' | 'paused' | 'stopped'>('stopped');
  const timerInterval = ref<number | null>(null);

  const time = computed(() => _time.value);
  const timeFormatted = computed(() => {
    return (
      `${_time.value.minutes}`.padStart(2, '0') + ':' + `${_time.value.seconds}`.padStart(2, '0')
    );
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
      status.value = 'running';
      timerInterval.value = window.setInterval(() => {
        Object.assign(_time.value, calculateTime(duration));

        if (_time.value.total <= 0) {
          clearInterval(timerInterval.value!);
          resolve();
        }
      }, SECOND_IN_MILLISECONDS);
    }).then(() => {
      status.value = 'stopped';
      initializeTime(_time, minutesRef);
    });
  };

  const resumeTimer = async () => {
    return new Promise<void>((resolve, reject) => {
      if (status.value !== 'paused') reject(`The timer is currently ${status.value}.`);
      const minutesFromCurrentTotal = _time.value.total / SECOND;
      startTimer(minutesFromCurrentTotal);
      resolve();
    });
  };

  const pauseTimer = async () => {
    return new Promise<void>((resolve) => {
      resetTimerInterval();
      resolve();
    }).then(() => {
      status.value = 'paused';
    });
  };

  const stopTimer = async () => {
    return new Promise<void>((resolve) => {
      resetTimerInterval();
      resolve();
    }).then(() => {
      status.value = 'stopped';
      initializeTime(_time, minutesRef);
    });
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
    stopTimer
  };
};
