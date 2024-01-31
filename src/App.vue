<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { RouterView, RouterLink } from 'vue-router';
import { usePomodoroTimerSettingStore, DEFAULT_TIME_SETTING } from '@/stores/timer-setting';
import Modal from '@/components/Modal.vue';
import TextInput from './components/TextInput.vue';
import { setDataMode } from '@/utils';

const pomodoroTimeSetting = usePomodoroTimerSettingStore();

const settingDialogVisible = ref(false);
const settingForm = reactive({ ...pomodoroTimeSetting.timeSetting });

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

onMounted(() => {
  setDataMode('pomodoro');
});
</script>

<template>
  <header class="flex justify-between items-center p-4">
    <RouterLink :to="{ name: 'home' }" class="brand text-2xl font-bold">
      <span>pom</span>
      <img src="@/assets/images/tomato-svgrepo-com.svg" class="w-5 inline" />
      <span>doro</span>
    </RouterLink>
    <div class="">
      <button class="btn-setting btn btn-sm" @click="handleSettingClick">
        <span class="bi bi-gear-fill"></span>
        Setting
      </button>
    </div>
  </header>
  <main class="container p-4">
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
      <button type="submit" class="btn" @click="handleClickReset">Reset</button>
      <button type="submit" class="btn btn-primary" form="form-setting">Save</button>
    </template>
  </Modal>
</template>
<style scoped>
.btn-setting {
  background-color: var(--color-black-alpha-2);
  color: var(--pomo-text-color);
  border: none;
}
</style>
