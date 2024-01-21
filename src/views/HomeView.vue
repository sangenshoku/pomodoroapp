<script setup lang="ts">
import PomodoroTimer from '@/components/PomodoroTimer.vue';
import { onBeforeMount, ref } from 'vue';

interface PomodoroMode {
  name: string;
  minutes: number;
}

const minutes = ref(1);

const currentMode = ref<PomodoroMode>();
const modes = {
  pomodoro: {
    name: 'Pomodoro',
    minutes: 25
  },
  shortBreak: {
    name: 'Short break',
    minutes: 5
  },
  longBreak: {
    name: 'Long break',
    minutes: 15
  }
};

const setMode = (mode: PomodoroMode) => {
  currentMode.value = mode;
  minutes.value = mode.minutes;
};

onBeforeMount(() => {
  setMode(modes.pomodoro);
});
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="flex flex-col items-center px-10 py-5 rounded-lg">
      <div class="flex gap-4">
        <button class="btn" v-for="(value, key) in modes" :key="key" @click="setMode(value)">
          {{ value.name }}
        </button>
      </div>
      <PomodoroTimer :minutes="minutes" />
    </div>
  </div>
</template>
