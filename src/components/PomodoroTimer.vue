<script setup lang="ts">
import { useTimer, TimerStatusEnum } from '@/composables/timer';
import type { PomodoroModeValue } from '@/stores/settings/timer-setting';
import { onMounted, onUnmounted, toRef, watch } from 'vue';
import Button from '@/components/Button.vue';
import { AlarmAudioService, ClockTickAudioService } from '@/services/audio-service';

// Error: [@vue/compiler-sfc] Failed to resolve index type into finite keys
// see: https://github.com/vuejs/core/issues/8286
// type PomodoroTimerEmits = { init: [minuteStr: string] } & {
//   [K in TimerStatus]: [minuteStr: string];
// };

interface PomodoroTimerProps {
  minutes: number;
  mode?: PomodoroModeValue;
  clockTickAudio?: ClockTickAudioService | null;
  alarmAudio?: AlarmAudioService | null;
}

const props = withDefaults(defineProps<PomodoroTimerProps>(), {
  mode: 'pomodoro'
});

const minutesRef = toRef(props, 'minutes');

const {
  timeFormatted,
  startTimer,
  resumeTimer,
  pauseTimer,
  stopTimer,
  status,
  isRunning,
  isStopped,
  isPaused,
  isFinished
} = useTimer(minutesRef);

const emits = defineEmits<{
  init: [minuteStr: string];
  running: [minuteStr: string];
  stopped: [minuteStr: string];
  paused: [minuteStr: string];
  finished: [minuteStr: string];
  modeChanged: [mode: string, minuteStr: string];
}>();

watch(
  [timeFormatted, status],
  ([newTime, newStatus]) => {
    if (newStatus === TimerStatusEnum.RUNNING) {
      emits('running', newTime);
    } else if (newStatus === TimerStatusEnum.STOPPED) {
      emits('stopped', newTime);
    } else if (newStatus === TimerStatusEnum.PAUSED) {
      emits('paused', newTime);
    } else if (newStatus === TimerStatusEnum.FINISHED) {
      emits('finished', newTime);
      props.alarmAudio?.play();
    }
  },
  { deep: true }
);

watch(
  () => props.mode,
  (newMode) => {
    emits('modeChanged', newMode, timeFormatted.value);
  }
);

const toggleTimer = async () => {
  if (isStopped() || isFinished()) {
    startTimer(props.minutes);
    props.clockTickAudio?.play();
  } else if (isPaused()) {
    await resumeTimer();
    props.clockTickAudio?.play();
  } else if (isRunning()) {
    await pauseTimer();
    props.clockTickAudio?.pause();
  }
};

const handleStopTimer = async () => {
  await stopTimer();
  props.clockTickAudio?.stop();
};

onMounted(() => {
  emits('init', timeFormatted.value);
});

onUnmounted(() => {
  props.clockTickAudio?.stop();
});
</script>
<template>
  <div class="pomodoro-timer inline-grid p-2" data-testid="pomodoro-timer" ref="pomodoro">
    <span class="time">
      {{ timeFormatted }}
    </span>
    <div class="pomodoro-control flex gap-4 justify-center">
      <Button class="btn-toggle-start w-1/2" size="large" @click="toggleTimer">
        {{ isRunning() ? 'Pause' : 'Start' }}
      </Button>
      <Button
        class="btn-stop"
        size="large"
        shape="circle"
        glass
        @click="handleStopTimer"
        v-if="isRunning()"
      >
        <span class="bi bi-stop-fill text-3xl text-white"></span>
      </Button>
    </div>
  </div>
</template>
<style scoped>
.time {
  color: var(--pomo-timer-text-color);
  font-size: 8rem;
  font-weight: bold;
}
.pomodoro-control {
  position: relative;
  width: 100%;
}

.btn-stop {
  position: absolute;
  right: 0;
}

.btn-toggle-start {
  background-color: #fff;
  color: var(--color-active-pomodoro);
}

@media only screen and (max-width: 640px) {
  .time {
    font-size: 6rem;
  }
}

@media only screen and (max-width: 500px) {
  .btn-stop {
    right: -0.5rem;
  }
}

@media only screen and (max-width: 320px) {
  .time {
    font-size: 5rem;
  }

  .btn-stop {
    right: -1.25rem;
  }
}
</style>
@/services/audio-service @/stores/settings/timer-setting
