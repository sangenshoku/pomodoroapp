<script setup lang="ts">
import { reactive, ref, toValue } from 'vue';
import { usePomodoroTimerSettingStore, type PomodoroModeValue } from '@/stores/timer-setting';
import { setHTMLTitle } from '@/utils';
import { useTasksStore, type Task, type TaskAdd } from '@/stores/tasks';
import { Modal, TaskList, TextInput, PomodoroTimer } from '@/components';
import { setDataMode } from '@/utils';

interface PomodoroMode {
  name: string;
  value: PomodoroModeValue;
}

const DEFAULT_TASK: Task = Object.freeze({
  id: '',
  title: '',
  estimatedPomodoros: 1,
  completedPomodoros: 0
});
const LONG_BREAK_INTERVAL = 4;

const pomodoroTimeSetting = usePomodoroTimerSettingStore();
const tasksStore = useTasksStore();

const currentMode = ref<PomodoroModeValue>('pomodoro');
const currentPomodoroCount = ref(1);
const addTaskModalVisible = ref(false);
const selectedTask = ref<Task>();
const formAddTask = reactive<TaskAdd>({ ...DEFAULT_TASK });

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

const updateHTMLTitle = (minuteStr: string) => {
  let message = `Let's focus!`;
  if (currentMode.value === 'shortBreak') {
    message = `Take a short break!`;
  } else if (currentMode.value === 'longBreak') {
    message = `Take a long break!`;
  }

  setHTMLTitle(`${minuteStr} - ${message}`);
};

const setMode = (mode: PomodoroModeValue) => {
  currentMode.value = mode;
  setDataMode(mode);
};

const handleInitPomodoro = (minuteStr: string) => {
  updateHTMLTitle(minuteStr);
};

const handleTimerEvent = (minuteStr: string) => {
  updateHTMLTitle(minuteStr);
};

const handleFinishedPomodoro = () => {
  switch (toValue(currentMode)) {
    case 'pomodoro': {
      if (toValue(currentPomodoroCount) % LONG_BREAK_INTERVAL === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }

      currentPomodoroCount.value++;

      const task = toValue(selectedTask);
      if (!task) return;

      task.completedPomodoros++;
      tasksStore.updateTask(task);
      break;
    }
    default: {
      setMode('pomodoro');
    }
  }
};

// FIXME: This is not working since there are multiple PomodoroTimer components
const handleModeChanged = (mode: string, minuteStr: string) => {
  updateHTMLTitle(minuteStr);
};

const handleClickAddTask = () => {
  addTaskModalVisible.value = true;
};

const handleSubmitAddTask = (event: Event) => {
  event.preventDefault();
  addTaskModalVisible.value = false;

  tasksStore.addTask(formAddTask);

  selectedTask.value ??= tasksStore.tasks[0];
  Object.assign(formAddTask, DEFAULT_TASK);
};

const handleClickDeleteAllTasks = () => {
  if (!confirm('Are you sure you want to delete all tasks?')) return;
  tasksStore.deleteAllTasks();
  selectedTask.value = undefined;
};
</script>

<template>
  <div class="flex flex-col items-center lg:w-[31.25rem] lg:mx-auto">
    <div class="pomodoro-container rounded-lg shadow">
      <div class="flex gap-4">
        <button
          class="btn btn-sm glass text-white"
          v-for="mode in modes"
          :key="mode.name"
          @click="setMode(mode.value)"
        >
          {{ mode.name }}
        </button>
      </div>
      <PomodoroTimer
        :minutes="pomodoroTimeSetting.getTimeSetting('pomodoro')"
        :mode="currentMode"
        @init="handleInitPomodoro"
        @running="handleTimerEvent"
        @paused="handleTimerEvent"
        @finished="handleFinishedPomodoro"
        @mode-changed="handleModeChanged"
        v-if="currentMode === 'pomodoro'"
      />
      <PomodoroTimer
        :minutes="pomodoroTimeSetting.getTimeSetting('shortBreak')"
        :mode="currentMode"
        @init="handleInitPomodoro"
        @running="handleTimerEvent"
        @paused="handleTimerEvent"
        @finished="handleFinishedPomodoro"
        @mode-changed="handleModeChanged"
        v-if="currentMode === 'shortBreak'"
      />
      <PomodoroTimer
        :minutes="pomodoroTimeSetting.getTimeSetting('longBreak')"
        :mode="currentMode"
        @init="handleInitPomodoro"
        @running="handleTimerEvent"
        @paused="handleTimerEvent"
        @finished="handleFinishedPomodoro"
        @mode-changed="handleModeChanged"
        v-if="currentMode === 'longBreak'"
      />
    </div>
    <div class="current-pomodoros">
      <span class="text-md" v-if="currentMode === 'pomodoro' || tasksStore.hasTasks">{{
        `# ${currentPomodoroCount}`
      }}</span>
      <span class="text-md" v-else-if="currentMode === 'shortBreak' && !tasksStore.hasTasks"
        >Take a short break!</span
      >
      <span class="text-md" v-else-if="currentMode === 'longBreak' && !tasksStore.hasTasks"
        >Take a long break!</span
      >
    </div>
    <div class="selected-task-container flex flex-col" v-if="selectedTask">
      <span class="text-lg">{{ selectedTask.title }}</span>
    </div>
    <div class="tasks-container grid gap-5 p-2 w-full">
      <div class="flex justify-between items-center border-b-2 p-2">
        <span class="text-lg font-bold tasks-label">Tasks</span>
        <button
          type="button"
          class="btn btn-remove-tasks btn-circle btn-sm"
          :disabled="!tasksStore.hasTasks"
          @click="handleClickDeleteAllTasks"
        >
          <span class="bi bi-trash"></span>
        </button>
      </div>
      <div class="tasks-container">
        <TaskList v-model:selected="selectedTask" :tasks="tasksStore.tasks" />
      </div>
      <button
        class="btn-add-task btn btn-outline btn-neutral btn-lg w-full"
        @click="handleClickAddTask"
      >
        Add task
      </button>
    </div>
  </div>
  <Modal v-model:visible="addTaskModalVisible" header="Add Task">
    <form id="form-add-task" class="grid gap-5" @submit="handleSubmitAddTask">
      <div class="form-control">
        <label for="task-name" class="label text-slate-500"> Task name </label>
        <TextInput bordered required v-model="formAddTask.title" />
      </div>
      <div class="form-control">
        <label for="estimated-pomodoros" class="label text-slate-500"> Estimated Pomodoros </label>
        <TextInput
          type="number"
          bordered
          min="1"
          required
          v-model="formAddTask.estimatedPomodoros"
        />
      </div>
    </form>
    <template #modalAction>
      <button type="submit" class="btn btn-primary" form="form-add-task">Add</button>
    </template>
  </Modal>
</template>
<style scoped>
.pomodoro-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 2rem;
  padding: 2.5rem 1.25rem;
}

.tasks-label {
  color: var(--pomo-heading-text-color);
}

.current-pomodoros,
.selected-task-container {
  color: var(--pomo-text-color);
}

.btn-add-task {
  color: var(--pomo-text-color);
  background-color: rgba(0, 0, 0, 0.1);
  border: none;
}

.btn-remove-tasks {
  background-color: var(--color-black-alpha-2);
  color: var(--pomo-text-color);
  border: none;
}
</style>
