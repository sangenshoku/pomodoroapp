<script setup lang="ts">
import { useTimer } from '@/composables/timer';
import { toRef } from 'vue';

const props = defineProps<{
  minutes: number;
}>();

const minutesRef = toRef(props, 'minutes');
const { timeFormatted, startTimer, resumeTimer, pauseTimer, stopTimer, status } =
  useTimer(minutesRef);

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
</script>
<template>
  <div class="pomodoro-timer inline-grid p-2">
    <span class="time">
      {{ timeFormatted }}
    </span>
    <div class="pomodoro-control flex gap-2 justify-center">
      <button class="btn" @click="toggleTimer">
        {{ status === 'running' ? 'Pause' : 'Start' }}
      </button>
      <button class="btn btn-error" @click="stopTimer" v-if="status === 'running'">Stop</button>
    </div>
  </div>
</template>
<style scoped>
.time {
  font-size: 8rem;
  font-weight: bold;
}
</style>
