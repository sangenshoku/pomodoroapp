<script setup lang="ts">
import PomodoroTimer from '@/components/PomodoroTimer.vue';
import { reactive, ref, toValue } from 'vue';
import { usePomodoroTimerSettingStore, type PomodoroModeValue } from '@/stores/timer-setting';
import { setHTMLTitle } from '@/utils';
import { useTasksStore, type Task, type TaskAdd } from '@/stores/tasks';
import Modal from '@/components/Modal.vue';
import TextInput from '@/components/TextInput.vue';
import TaskList from '@/components/tasks/TaskList.vue';

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
      console.log('finished pomodoro');

      if (toValue(currentPomodoroCount) % 2 === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }

      currentPomodoroCount.value += 1;

      const task = toValue(selectedTask);
      if (!task) return;

      task.completedPomodoros += 1;
      tasksStore.updateTask(task);
      break;
    }
    default: {
      console.log('finished break');
      setMode('pomodoro');
    }
  }
};

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
        <button class="btn" v-for="mode in modes" :key="mode.name" @click="setMode(mode.value)">
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
      <span class="text-md">{{ `# ${currentPomodoroCount}` }}</span>
    </div>
    <div class="selected-task-container flex flex-col" v-if="selectedTask">
      <span class="text-lg">{{ selectedTask.title }}</span>
    </div>
    <div class="tasks-container grid gap-5 p-2 w-full">
      <div class="flex justify-between items-center border-b-2 p-2">
        <span class="text-lg font-bold">Tasks</span>
        <button
          type="button"
          class="btn btn-circle btn-sm btn-error btn-outline"
          :disabled="!tasksStore.hasTasks"
          @click="handleClickDeleteAllTasks"
        >
          <span class="bi bi-trash-fill"></span>
        </button>
      </div>
      <div class="tasks-container">
        <TaskList v-model:selected="selectedTask" :tasks="tasksStore.tasks" />
      </div>
      <button class="btn btn-outline btn-lg w-full" @click="handleClickAddTask">Add task</button>
    </div>
  </div>
  <Modal v-model:visible="addTaskModalVisible" header="Add Task">
    <form id="form-add-task" class="grid gap-5" @submit="handleSubmitAddTask">
      <TextInput placeholder="Task name" bordered required v-model="formAddTask.title" />
      <TextInput
        type="number"
        placeholder="# of Pomodoros"
        bordered
        min="1"
        required
        v-model="formAddTask.estimatedPomodoros"
      />
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
</style>
