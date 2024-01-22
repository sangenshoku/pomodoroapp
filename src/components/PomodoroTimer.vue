<script setup lang="ts">
import { useTimer } from '@/composables/timer';
import { onMounted, toRef, watch } from 'vue';

const props = defineProps<{
  minutes: number;
}>();

const minutesRef = toRef(props, 'minutes');
const { timeFormatted, startTimer, resumeTimer, pauseTimer, stopTimer, status } =
  useTimer(minutesRef);

const emits = defineEmits<{
  init: [minuteStr: string];
  running: [minuteStr: string];
  stopped: [minuteStr: string];
  paused: [minuteStr: string];
}>();

watch(
  [timeFormatted, status],
  ([newTime, newStatus]) => {
    if (newStatus === 'running') {
      emits('running', newTime);
    } else if (newStatus === 'stopped') {
      emits('stopped', newTime);
    } else if (newStatus === 'paused') {
      emits('paused', newTime);
    }
  },
  { deep: true }
);

const toggleTimer = () => {
  switch (status.value) {
    case 'stopped':
      startTimer(props.minutes);
      break;
    case 'paused':
      resumeTimer();
      break;
    case 'running':
      pauseTimer();
      break;
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
        {{ status === 'running' ? 'Pause' : 'Start' }}
      </button>
      <button
        class="btn-stop btn btn-error btn-lg btn-circle"
        @click="stopTimer"
        v-if="status === 'running'"
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
