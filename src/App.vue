<script setup lang="ts">
import { reactive, ref } from 'vue';
import { RouterView, RouterLink } from 'vue-router';
import { usePomodoroTimerSettingStore, DEFAULT_TIME_SETTING } from '@/stores/timer-setting';

const pomodoroTimeSetting = usePomodoroTimerSettingStore();

const settingDialog = ref<HTMLDialogElement>();
const settingForm = reactive({ ...pomodoroTimeSetting.timeSetting });

const handleSettingClick = () => {
  settingDialog.value?.showModal();
};

const handleSaveSetting = (event: Event) => {
  event.preventDefault();
  pomodoroTimeSetting.setTimeSetting(settingForm);
  settingDialog.value?.close();
};

const handleClickReset = () => {
  Object.assign(settingForm, DEFAULT_TIME_SETTING);
};
</script>

<template>
  <header class="flex justify-between items-center p-4">
    <RouterLink :to="{ name: 'home' }" class="brand text-2xl font-bold">
      <span>pom</span>
      <img src="@/assets/images/tomato-svgrepo-com.svg" class="w-5 inline" />
      <span>doro</span>
    </RouterLink>
    <div class="">
      <button class="btn btn-sm" @click="handleSettingClick">
        <span class="bi bi-gear-fill"></span>
        Setting
      </button>
    </div>
  </header>
  <main class="container p-4">
    <RouterView />
  </main>
  <dialog class="modal" ref="settingDialog">
    <div class="modal-box max-w-md">
      <div class="modal-header flex justify-between items-center mb-5">
        <h3 class="font-bold text-lg">Setting</h3>

        <form method="dialog">
          <button class="btn btn-sm btn-circle">
            <span class="bi bi-x-lg"></span>
          </button>
        </form>
      </div>
      <form id="form-setting" @submit="handleSaveSetting">
        <div class="grid grid-cols-3 gap-3">
          <div class="form-control">
            <label for="pomodoro mb-3">
              <span class="text-slate-500">Pomodoro</span>
            </label>
            <input
              type="number"
              class="input input-bordered input-sm"
              id="pomodoro"
              min="0"
              v-model="settingForm.pomodoro"
            />
          </div>
          <div class="form-control">
            <label for="short-break mb-3">
              <span class="text-slate-500">Short Break</span>
            </label>
            <input
              type="number"
              class="input input-bordered input-sm"
              id="short-break"
              min="0"
              v-model="settingForm.shortBreak"
            />
          </div>
          <div class="form-control">
            <label for="long-break mb-3">
              <span class="text-slate-500">Long Break</span>
            </label>
            <input
              type="number"
              class="input input-bordered input-sm"
              id="long-break"
              min="0"
              v-model="settingForm.longBreak"
            />
          </div>
        </div>
      </form>
      <div class="modal-action">
        <button type="submit" class="btn" @click="handleClickReset">Reset</button>
        <button type="submit" class="btn btn-primary" form="form-setting">Save</button>
      </div>
    </div>
  </dialog>
</template>
