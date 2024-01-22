<script setup lang="ts">
import { useTimer, TimerStatusEnum } from '@/composables/timer';
import { onMounted, toRef, watch } from 'vue';

// Error: [@vue/compiler-sfc] Failed to resolve index type into finite keys
// see: https://github.com/vuejs/core/issues/8286
// type PomodoroTimerEmits = { init: [minuteStr: string] } & {
//   [K in TimerStatus]: [minuteStr: string];
// };

const props = defineProps<{
  minutes: number;
}>();

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
  isPaused
} = useTimer(minutesRef);

const emits = defineEmits<{
  init: [minuteStr: string];
  running: [minuteStr: string];
  stopped: [minuteStr: string];
  paused: [minuteStr: string];
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
    }
  },
  { deep: true }
);

const toggleTimer = () => {
  if (isStopped()) {
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
  <div class="pomodoro-timer inline-grid p-2" data-testid="pomodoro-timer">
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
