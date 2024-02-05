<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { RouterView, RouterLink } from 'vue-router';
import { usePomodoroTimerSettingStore, DEFAULT_TIME_SETTING } from '@/stores/timer-setting';
import Modal from '@/components/Modal.vue';
import TextInput from './components/TextInput.vue';
import { setDataMode } from '@/utils';
import Button from '@/components/Button.vue';
import { useAuthStore } from './stores/auth';
import { useRouter } from 'vue-router';
import Toaster from './components/Toaster.vue';

const pomodoroTimeSetting = usePomodoroTimerSettingStore();
const authStore = useAuthStore();
const router = useRouter();

const settingDialogVisible = ref(false);
const settingForm = reactive({ ...pomodoroTimeSetting.timeSetting });

const authRoutes = ['register', 'login'];

const handleSettingClick = () => {
  settingDialogVisible.value = true;
};

const handleSaveSetting = (event: Event) => {
  event.preventDefault();
  pomodoroTimeSetting.setTimeSetting(settingForm);
  settingDialogVisible.value = false;
};

const handleClickReset = () => {
  Object.assign(settingForm, DEFAULT_TIME_SETTING);
};

const handleClickLogin = () => {
  router.push({ name: 'login' });
};

const handleClickLogout = () => {
  if (authStore.isLoading('logout')) return;
  authStore.logout();
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
    <RouterLink :to="{ name: 'home' }" class="brand text-4xl font-bold">
      <span>pom</span>
      <img src="@/assets/images/tomato-svgrepo-com.svg" class="w-6 inline" />
      <span>doro</span>
    </RouterLink>
  </header>
  <header class="flex justify-between items-center p-4" v-else-if="$route.name !== 'not-found'">
    <RouterLink :to="{ name: 'home' }" class="brand text-2xl font-bold">
      <span>pom</span>
      <img src="@/assets/images/tomato-svgrepo-com.svg" class="w-5 inline" />
      <span>doro</span>
    </RouterLink>
    <div class="flex gap-2">
      <Button class="btn-setting" size="small" default @click="handleSettingClick">
        <span class="bi bi-gear-fill"></span>
        Setting
      </Button>
      <Button
        class="btn-setting"
        size="small"
        default
        v-if="!authStore.isAuthenticated"
        @click="handleClickLogin"
      >
        <span class="bi bi-person-fill"></span>
        Login
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
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  </header>
  <main class="container p-4 h-full">
    <RouterView />
  </main>
  <Modal v-model:visible="settingDialogVisible" header="Setting">
    <form id="form-setting" @submit="handleSaveSetting">
      <div class="grid grid-cols-3 gap-3">
        <div class="form-control">
          <label for="pomodoro" class="label">
            <span class="text-slate-500">Pomodoro</span>
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
            <span class="text-slate-500">Short Break</span>
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
            <span class="text-slate-500">Long Break</span>
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
    </form>
    <template #modalAction>
      <Button type="button" @click="handleClickReset">Reset</Button>
      <Button type="submit" color="primary" form="form-setting">Save</Button>
    </template>
  </Modal>
  <Toaster />
</template>
