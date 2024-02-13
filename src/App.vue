<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { RouterView, RouterLink } from 'vue-router';
import {
  usePomodoroTimerSettingStore,
  DEFAULT_TIME_SETTING
} from '@/stores/settings/timer-setting';
import {
  usePomodoroAudioSettingStore,
  DEFAULT_SOUND_SETTING
} from './stores/settings/audio-setting';
import Modal from '@/components/Modal.vue';
import TextInput from './components/TextInput.vue';
import { setDataMode } from '@/utils';
import Button from '@/components/Button.vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Toaster from './components/Toaster.vue';
import type { Alarm, ClockTick } from './services/audio-service';

type SoundSelect = {
  tickSound: {
    label: string;
    value: null | ClockTick;
    selected?: boolean;
  }[];
  alarmSound: {
    label: string;
    value: null | Alarm;
    selected?: boolean;
  }[];
};

const pomodoroTimeSetting = usePomodoroTimerSettingStore();
const pomodoroAudioSetting = usePomodoroAudioSettingStore();
const authStore = useAuthStore();
const router = useRouter();

const settingDialogVisible = ref(false);
const settingForm = reactive(getSettingFormData());

const authRoutes = ['register', 'login'];
const selects: SoundSelect = {
  tickSound: [
    { label: 'None', value: null },
    { label: 'Clock', value: 'clockTick' }
  ],
  alarmSound: [
    { label: 'None', value: null },
    { label: 'Digital 1', value: 'digital1' },
    { label: 'Bell', value: 'bell' }
  ]
};

function getSettingFormData() {
  return {
    ...pomodoroTimeSetting.timeSetting,
    ...pomodoroAudioSetting.soundSetting
  };
}

const initializeSettingForm = (form: typeof settingForm) => {
  Object.assign(settingForm, form);
};

const handleSettingClick = () => {
  settingDialogVisible.value = true;
};

const handleSaveSetting = (event: Event) => {
  event.preventDefault();
  pomodoroTimeSetting.setTimeSetting(settingForm);
  pomodoroAudioSetting.setTick(settingForm.tick);
  pomodoroAudioSetting.setAlarm(settingForm.alarm);
  settingDialogVisible.value = false;
};

const handleClickReset = () => {
  initializeSettingForm({
    ...DEFAULT_TIME_SETTING,
    ...DEFAULT_SOUND_SETTING
  });
};

const handleClickLogin = () => {
  router.push({ name: 'login' });
};

const handleClickLogout = () => {
  if (authStore.isLoading('logout')) return;
  authStore.logout();
};

const handleCloseModal = () => {
  initializeSettingForm(getSettingFormData());
};

onMounted(() => {
  setDataMode('pomodoro');
});
</script>

<template>
  <header
    class="flex justify-center items-center p-4"
    v-if="authRoutes.includes(String($route.name))"
  >
    <RouterLink :to="{ name: 'home' }" class="brand-auth text-4xl font-bold">
      <span>pom</span>
      <img src="@/assets/images/tomato-svgrepo-com.svg" class="w-6 inline" />
      <span>doro</span>
    </RouterLink>
  </header>
  <header class="flex justify-between items-center p-4" v-else-if="$route.name !== 'not-found'">
    <RouterLink :to="{ name: 'home' }" class="brand flex items-center text-2xl font-bold">
      <span>pom</span>
      <img src="@/assets/images/tomato-svgrepo-com.svg" class="w-5 inline" />
      <span>doro</span>
    </RouterLink>
    <RouterLink :to="{ name: 'home' }" class="brand-small flex items-center text-2xl font-bold">
      <img src="@/assets/images/tomato-svgrepo-com.svg" class="w-5 inline" />
    </RouterLink>
    <div class="flex gap-2">
      <Button class="btn-setting" size="small" default @click="handleSettingClick">
        <span class="bi bi-gear-fill"></span>
        <span class="text"> Setting </span>
      </Button>
      <Button
        class="btn-login"
        size="small"
        default
        v-if="!authStore.isAuthenticated"
        @click="handleClickLogin"
      >
        <span class="bi bi-person-fill"></span>
        <span class="text"> Login </span>
      </Button>
      <div class="dropdown dropdown-end" v-else>
        <Button size="small" shape="circle" tabindex="0" default>
          <span class="bi bi-person-circle"></span>
        </Button>
        <ul
          tabindex="0"
          class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32 mt-2"
        >
          <li>
            <a @click="handleClickLogout">
              <span class="bi bi-box-arrow-right"></span>
              <span>Logout</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </header>
  <main class="container p-4 h-full">
    <RouterView />
  </main>
  <Modal v-model:visible="settingDialogVisible" header="Setting" @close="handleCloseModal">
    <form class="grid gap-1" id="form-setting" @submit="handleSaveSetting">
      <div class="timer-setting grid gap-5">
        <h6 class="font-bold text-zinc-500">
          <span class="bi bi-stopwatch me-2"></span>
          <span>Timer</span>
        </h6>
        <div class="grid grid-cols-3 gap-3">
          <div class="form-control">
            <label for="pomodoro" class="label">
              <span class="text-slate-500 label-text">Pomodoro</span>
            </label>
            <TextInput
              type="number"
              size="small"
              id="pomodoro"
              min="0"
              step=".01"
              bordered
              v-model="settingForm.pomodoro"
            />
          </div>
          <div class="form-control">
            <label for="short-break" class="label">
              <span class="text-slate-500 label-text">Short Break</span>
            </label>
            <TextInput
              type="number"
              size="small"
              id="short-break"
              min="0"
              step=".01"
              bordered
              v-model="settingForm.shortBreak"
            />
          </div>
          <div class="form-control">
            <label for="long-break" class="label">
              <span class="text-slate-500 label-text">Long Break</span>
            </label>
            <TextInput
              type="number"
              size="small"
              id="long-break"
              min="0"
              step=".01"
              bordered
              v-model="settingForm.longBreak"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 items-center">
          <label for="long-break-interval" class="label text-zinc-600 font-medium"
            >Long Break Interval</label
          >
          <TextInput
            type="number"
            size="small"
            id="long-break-interval"
            min="1"
            step="1"
            bordered
            v-model="settingForm.longBreakInterval"
          />
        </div>
      </div>
      <div class="divider"></div>
      <div class="sound-setting grid gap-5">
        <h6 class="font-bold text-zinc-500">
          <span class="bi bi-music-note me-2"></span>
          <span>Sound</span>
        </h6>
        <div class="grid grid-cols-2 gap-3 items-center">
          <label for="tick-sound" class="label text-zinc-600 font-medium">Ticking Sound</label>
          <select
            class="select select-bordered select-sm w-full max-w-xs"
            id="tick-sound"
            v-model="settingForm.tick"
          >
            <option v-for="sound in selects.tickSound" :key="sound.label" :value="sound.value">
              {{ sound.label }}
            </option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-3 items-center">
          <label for="alarm-sound" class="label text-zinc-600 font-medium">Alarm Sound</label>
          <select
            class="select select-bordered select-sm w-full max-w-xs"
            id="alarm-sound"
            v-model="settingForm.alarm"
          >
            <option v-for="sound in selects.alarmSound" :key="sound.label" :value="sound.value">
              {{ sound.label }}
            </option>
          </select>
        </div>
      </div>
    </form>
    <template #modalAction>
      <Button type="button" @click="handleClickReset">Reset</Button>
      <Button type="submit" color="primary" form="form-setting">Save</Button>
    </template>
  </Modal>
  <Toaster />
</template>
@/stores/settings/timer-setting
