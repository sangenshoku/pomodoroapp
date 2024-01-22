<script setup lang="ts">
import PomodoroTimer from '@/components/PomodoroTimer.vue';
import { ref } from 'vue';
import { usePomodoroTimerSettingStore, type PomodoroModeValue } from '@/stores/timer-setting';
import { setHTMLTitle } from '@/utils';

interface PomodoroMode {
  name: string;
  value: PomodoroModeValue;
}

const pomodoroTimeSetting = usePomodoroTimerSettingStore();

const currentMode = ref<PomodoroModeValue>('pomodoro');

const modes: PomodoroMode[] = [
  {
    name: 'Pomodoro',
    value: 'pomodoro'
  },
  {
    name: 'Short break',
    value: 'shortBreak'
  },
  {
    name: 'Long break',
    value: 'longBreak'
  }
];

const setMode = (mode: PomodoroModeValue) => {
  currentMode.value = mode;
};

const handleTimerEvent = (minuteStr: string) => {
  let message = `Let's focus!`;
  if (currentMode.value === 'shortBreak') {
    message = `Take a short break!`;
  } else if (currentMode.value === 'longBreak') {
    message = `Take a long break!`;
  }

  setHTMLTitle(`${minuteStr} - ${message}`);
};
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="flex flex-col items-center px-10 py-5 rounded-lg">
      <div class="flex gap-4">
        <button class="btn" v-for="mode in modes" :key="mode.name" @click="setMode(mode.value)">
          {{ mode.name }}
        </button>
      </div>
      <PomodoroTimer
        :minutes="pomodoroTimeSetting.getTimeSetting(currentMode)"
        @init="handleTimerEvent"
        @running="handleTimerEvent"
        @stopped="handleTimerEvent"
        @paused="handleTimerEvent"
      />
    </div>
  </div>
</template>
