<script setup lang="ts">
import { reactive, ref, toValue } from 'vue';
import { usePomodoroTimerSettingStore, type PomodoroModeValue } from '@/stores/timer-setting';
import { setHTMLTitle } from '@/utils';
import { useTasksStore, type Task, type TaskAdd } from '@/stores/tasks';
import { Modal, TaskList, TextInput, PomodoroTimer } from '@/components';
import { setDataMode } from '@/utils';
import Button from '@/components/Button.vue';

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
  if (pomodoroTimeSetting.isMode('shortBreak')) {
    message = `Take a short break!`;
  } else if (pomodoroTimeSetting.isMode('longBreak')) {
    message = `Take a long break!`;
  }

  setHTMLTitle(`${minuteStr} - ${message}`);
};

const setMode = (mode: PomodoroModeValue) => {
  pomodoroTimeSetting.setMode(mode);
  setDataMode(mode);
};

const handleInitPomodoro = (minuteStr: string) => {
  updateHTMLTitle(minuteStr);
};

const handleTimerEvent = (minuteStr: string) => {
  updateHTMLTitle(minuteStr);
};

const handleFinishedPomodoro = () => {
  switch (pomodoroTimeSetting.currentMode) {
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
  <div class="flex flex-col items-center main-wrapper mx-auto">
    <div class="pomodoro-container rounded-lg shadow">
      <div class="flex gap-4">
        <Button
          class="text-white"
          size="small"
          glass
          v-for="mode in modes"
          :key="mode.name"
          @click="setMode(mode.value)"
        >
          {{ mode.name }}
        </Button>
      </div>
      <PomodoroTimer
        :minutes="pomodoroTimeSetting.getTimeSetting('pomodoro')"
        :mode="pomodoroTimeSetting.currentMode"
        @init="handleInitPomodoro"
        @running="handleTimerEvent"
        @paused="handleTimerEvent"
        @finished="handleFinishedPomodoro"
        @mode-changed="handleModeChanged"
        v-if="pomodoroTimeSetting.isMode('pomodoro')"
      />
      <PomodoroTimer
        :minutes="pomodoroTimeSetting.getTimeSetting('shortBreak')"
        :mode="pomodoroTimeSetting.currentMode"
        @init="handleInitPomodoro"
        @running="handleTimerEvent"
        @paused="handleTimerEvent"
        @finished="handleFinishedPomodoro"
        @mode-changed="handleModeChanged"
        v-if="pomodoroTimeSetting.isMode('shortBreak')"
      />
      <PomodoroTimer
        :minutes="pomodoroTimeSetting.getTimeSetting('longBreak')"
        :mode="pomodoroTimeSetting.currentMode"
        @init="handleInitPomodoro"
        @running="handleTimerEvent"
        @paused="handleTimerEvent"
        @finished="handleFinishedPomodoro"
        @mode-changed="handleModeChanged"
        v-if="pomodoroTimeSetting.isMode('longBreak')"
      />
    </div>
    <div class="current-pomodoros">
      <span class="text-md" v-if="pomodoroTimeSetting.isMode('pomodoro') || tasksStore.hasTasks">{{
        `# ${currentPomodoroCount}`
      }}</span>
      <span
        class="text-md"
        v-else-if="pomodoroTimeSetting.isMode('shortBreak') && !tasksStore.hasTasks"
        >Take a short break!</span
      >
      <span
        class="text-md"
        v-else-if="pomodoroTimeSetting.isMode('longBreak') && !tasksStore.hasTasks"
        >Take a long break!</span
      >
    </div>
    <div class="selected-task-container flex flex-col" v-if="selectedTask">
      <span class="text-lg">{{ selectedTask.title }}</span>
    </div>
    <div class="tasks-container grid gap-5 p-2 w-full">
      <div class="flex justify-between items-center border-b-2 p-2">
        <span class="text-lg font-bold tasks-label">Tasks</span>
        <Button
          type="button"
          size="small"
          class="btn-remove-tasks"
          :disabled="!tasksStore.hasTasks"
          shape="circle"
          @click="handleClickDeleteAllTasks"
        >
          <span class="bi bi-trash"></span>
        </Button>
      </div>
      <div class="tasks-container">
        <TaskList v-model:selected="selectedTask" :tasks="tasksStore.tasks" />
      </div>
      <Button class="btn-add-task w-full" size="large" outlined @click="handleClickAddTask">
        Add task
      </Button>
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
      <Button type="submit" color="primary" form="form-add-task">Add</Button>
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

@media only screen and (min-width: 460px) and (max-width: 640px) {
  .pomodoro-container {
    width: 26rem;
  }
}
</style>
