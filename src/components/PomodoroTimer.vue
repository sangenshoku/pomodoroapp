<script setup lang="ts">
import { useTimer, TimerStatusEnum } from '@/composables/timer';
import type { PomodoroModeValue } from '@/stores/timer-setting';
import { onMounted, toRef, watch } from 'vue';

// Error: [@vue/compiler-sfc] Failed to resolve index type into finite keys
// see: https://github.com/vuejs/core/issues/8286
// type PomodoroTimerEmits = { init: [minuteStr: string] } & {
//   [K in TimerStatus]: [minuteStr: string];
// };

interface PomodoroTimerProps {
  minutes: number;
  mode?: PomodoroModeValue;
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

const toggleTimer = () => {
  if (isStopped() || isFinished()) {
    startTimer(props.minutes);
  } else if (isPaused()) {
    resumeTimer();
  } else if (isRunning()) {
    pauseTimer();
  }
};

onMounted(() => {
  emits('init', timeFormatted.value);
});
</script>
<template>
  <div class="pomodoro-timer inline-grid p-2" data-testid="pomodoro-timer" ref="pomodoro">
    <span class="time">
      {{ timeFormatted }}
    </span>
    <div class="pomodoro-control flex gap-4 justify-center">
      <button class="btn-toggle-start btn btn-lg btn-primary" @click="toggleTimer">
        {{ isRunning() ? 'Pause' : 'Start' }}
      </button>
      <button
        class="btn-stop btn btn-error btn-lg btn-circle"
        @click="stopTimer"
        v-if="isRunning()"
      >
        <span class="bi bi-stop-fill text-3xl text-white"></span>
      </button>
    </div>
  </div>
</template>
<style scoped>
.time {
  font-size: 8rem;
  font-weight: bold;
}
</style>
