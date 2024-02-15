<script setup lang="ts">
import { reactive, ref, toValue, watch, type DeepReadonly, computed } from 'vue';
import {
  usePomodoroTimerSettingStore,
  type PomodoroModeValue
} from '@/stores/settings/timer-setting';
import { setHTMLTitle } from '@/utils';
import { type TaskData, Task } from '@/models/task';
import { useTasksStore, type TaskOrReadonlyTask } from '@/stores/tasks';
import { Modal, TaskList, TextInput, PomodoroTimer } from '@/components';
import { setDataMode } from '@/utils';
import Button from '@/components/Button.vue';
import { useTaskService } from '@/services/task-service';
import { useAuthStore } from '@/stores/auth';
import { usePomodoroAudioSettingStore } from '@/stores/settings/audio-setting';

interface PomodoroMode {
  name: string;
  shortName: string;
  value: PomodoroModeValue;
}

type DefaultTask = Pick<TaskData, 'id' | 'title' | 'estimatedPomodoros'>;

const DEFAULT_ADD_TASK: DefaultTask = Object.freeze({
  id: '',
  title: '',
  estimatedPomodoros: 1
});

const DEFAULT_UPDATE_TASK = Object.freeze({
  ...DEFAULT_ADD_TASK,
  completedPomodoros: 0,
  done: false
});

const pomodoroTimeSetting = usePomodoroTimerSettingStore();
const tasksStore = useTasksStore();
const authStore = useAuthStore();
const pomodoroAudioSetting = usePomodoroAudioSettingStore();

const taskService = useTaskService();

const currentPomodoroCount = ref(1);
const addTaskModalVisible = ref(false);
const updateTaskModalVisible = ref(false);
const selectedTask = ref<Task | DeepReadonly<Task>>();
const formAddTask = reactive({ ...DEFAULT_ADD_TASK });
const formUpdateTask = reactive({ ...DEFAULT_UPDATE_TASK });

const hasTasks = computed(() =>
  authStore.isAuthenticated ? taskService.hasTasks() : tasksStore.hasTasks
);

watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    resetSelectedTask();
    tasksStore.deleteAllTasks();

    if (!isAuthenticated) return;

    taskService.getTasks().then((tasks) => {
      setEmptySelectedTask(tasks[0]);
    });
  },
  { immediate: true }
);

const modes: PomodoroMode[] = [
  {
    name: 'Pomodoro',
    shortName: 'Pomo',
    value: 'pomodoro'
  },
  {
    name: 'Short break',
    shortName: 'Short',
    value: 'shortBreak'
  },
  {
    name: 'Long break',
    shortName: 'Long',
    value: 'longBreak'
  }
];

const tasksActionsDropdownMenu = [
  {
    label: 'Remove Finished Tasks',
    icon: 'bi bi-trash',
    action: () => {
      handleClickDeleteFinishedTasks();
    },
    isDisabled: () =>
      authStore.isAuthenticated ? !taskService.hasFinishedTasks() : !tasksStore.hasFinishedTasks
  },
  {
    label: 'Remove All Tasks',
    icon: 'bi bi-trash',
    action: () => {
      handleClickDeleteAllTasks();
    }
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
      if (toValue(currentPomodoroCount) % pomodoroTimeSetting.timeSetting.longBreakInterval === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }

      currentPomodoroCount.value++;

      const task = toValue(selectedTask);
      if (!task) return;

      const cloned = task.clone().incrementCompletedPomodoros();

      if (authStore.isAuthenticated) {
        taskService.updateTask(cloned.toUpdateRequest());
      } else {
        tasksStore.updateTask(cloned);
      }
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
  openModalAddTask();
};

const handleClickUpdateTask = (task: TaskOrReadonlyTask) => {
  const { id, title, estimatedPomodoros, completedPomodoros, done } = task;

  openModalUpdateTask();

  Object.assign(formUpdateTask, {
    id,
    title,
    estimatedPomodoros,
    completedPomodoros,
    done
  });
};

const handleClickDeleteTask = async () => {
  const { id } = formUpdateTask;
  if (authStore.isAuthenticated) {
    await taskService.deleteTask(id);
  } else {
    tasksStore.deleteTask(id);
  }

  closeModalUpdateTask();
};

const handleSubmitAddTask = async (event: Event) => {
  event.preventDefault();

  if (!authStore.isAuthenticated) {
    tasksStore.addTask(formAddTask);
    setEmptySelectedTask(tasksStore.tasks[0]);
  } else {
    await taskService.addTask({
      title: formAddTask.title,
      estimatedPomodoros: formAddTask.estimatedPomodoros
    });
    setEmptySelectedTask(taskService.tasks[0]);
  }

  closeModalAddTask();
  resetFormAddTask();
};

const handleSubmitUpdateTask = async (event: Event) => {
  event.preventDefault();

  if (authStore.isAuthenticated) {
    await taskService.updateTask(formUpdateTask);
  } else {
    tasksStore.updateTask(formUpdateTask);
  }

  closeModalUpdateTask();
  resetFormUpdateTask();
};

const handleToggleDone = async (task: TaskOrReadonlyTask, isDone: boolean) => {
  const cloned = task.clone();

  isDone ? cloned.markAsDone() : cloned.markAsUndone();

  if (authStore.isAuthenticated) {
    await taskService.updateTask(cloned.toUpdateRequest());
  } else {
    tasksStore.updateTask(cloned);
  }
};

const handleClickDeleteAllTasks = async () => {
  if (!confirm('Are you sure you want to delete all tasks?')) return;

  if (authStore.isAuthenticated) {
    await taskService.deleteAllTasks();
  } else {
    tasksStore.deleteAllTasks();
  }

  resetSelectedTask();
};

const handleClickDeleteFinishedTasks = async () => {
  if (!confirm('Are you sure you want to delete finished tasks?') || !tasksStore.hasFinishedTasks)
    return;

  if (authStore.isAuthenticated) {
    await taskService.deleteFinishedTasks();
  } else {
    tasksStore.deleteFinishedTasks();
  }

  resetSelectedTask();
};

const openModalAddTask = () => {
  addTaskModalVisible.value = true;
};

const openModalUpdateTask = () => {
  updateTaskModalVisible.value = true;
};

const closeModalAddTask = () => {
  addTaskModalVisible.value = false;
};

const closeModalUpdateTask = () => {
  updateTaskModalVisible.value = false;
};

const setSelectedTask = (task: TaskOrReadonlyTask) => {
  selectedTask.value = task;
};

const setEmptySelectedTask = (task: TaskOrReadonlyTask) => {
  if (toValue(selectedTask)) return;
  setSelectedTask(task);
};

const resetFormAddTask = () => {
  Object.assign(formAddTask, DEFAULT_ADD_TASK);
};

const resetFormUpdateTask = () => {
  Object.assign(formUpdateTask, DEFAULT_UPDATE_TASK);
};

function resetSelectedTask() {
  selectedTask.value = undefined;
}
</script>

<template>
  <div class="flex flex-col items-center main-wrapper mx-auto">
    <div class="pomodoro-container rounded-lg shadow">
      <div class="mode-controls flex gap-4">
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
      <div class="mode-controls-short flex gap-4">
        <Button
          class="text-white"
          size="small"
          glass
          v-for="mode in modes"
          :key="mode.shortName"
          @click="setMode(mode.value)"
        >
          {{ mode.shortName }}
        </Button>
      </div>
      <PomodoroTimer
        :minutes="pomodoroTimeSetting.getTimeSetting('pomodoro')"
        :mode="pomodoroTimeSetting.currentMode"
        :clock-tick-audio="pomodoroAudioSetting.currentClockTickAudio"
        :alarm-audio="pomodoroAudioSetting.currentAlarmAudio"
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
        :clock-tick-audio="pomodoroAudioSetting.currentClockTickAudio"
        :alarm-audio="pomodoroAudioSetting.currentAlarmAudio"
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
        :clock-tick-audio="pomodoroAudioSetting.currentClockTickAudio"
        :alarm-audio="pomodoroAudioSetting.currentAlarmAudio"
        @init="handleInitPomodoro"
        @running="handleTimerEvent"
        @paused="handleTimerEvent"
        @finished="handleFinishedPomodoro"
        @mode-changed="handleModeChanged"
        v-if="pomodoroTimeSetting.isMode('longBreak')"
      />
    </div>
    <div class="current-pomodoros">
      <span class="text-md" v-if="pomodoroTimeSetting.isMode('pomodoro') || hasTasks">{{
        `# ${currentPomodoroCount}`
      }}</span>
      <span class="text-md" v-else-if="pomodoroTimeSetting.isMode('shortBreak') && !hasTasks"
        >Take a short break!</span
      >
      <span class="text-md" v-else-if="pomodoroTimeSetting.isMode('longBreak') && !hasTasks"
        >Take a long break!</span
      >
    </div>
    <div class="selected-task-container flex flex-col" v-if="selectedTask">
      <span class="text-lg">{{ selectedTask.title }}</span>
    </div>
    <div class="tasks-container grid gap-5 p-2 w-full">
      <div class="flex justify-between items-center border-b-2 p-2">
        <span class="text-lg font-bold tasks-label">Tasks</span>
        <div class="dropdown dropdown-end">
          <Button size="small" shape="circle" tabindex="0" :disabled="!hasTasks" default>
            <span class="bi bi-three-dots-vertical"></span>
          </Button>
          <ul
            tabindex="0"
            class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-60 mt-2"
          >
            <li v-for="item in tasksActionsDropdownMenu" :key="item.label">
              <a :class="{ disabled: item.isDisabled?.() }" @click="item.action">
                <span :class="item.icon"></span>
                <span>{{ item.label }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="tasks-container">
        <TaskList
          v-model:selected="selectedTask"
          :tasks="authStore.isAuthenticated ? taskService.tasks : tasksStore.tasks"
          @click:edit="handleClickUpdateTask"
          @toggle:done="handleToggleDone"
        />
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
  <Modal v-model:visible="updateTaskModalVisible" header="Update Task">
    <form id="form-update-task" class="grid gap-5" @submit="handleSubmitUpdateTask">
      <div class="form-control">
        <label for="task-name" class="label text-slate-500"> Task name </label>
        <TextInput bordered required v-model="formUpdateTask.title" />
      </div>
      <div class="form-control">
        <label for="estimated-pomodoros" class="label text-slate-500"> Estimated Pomodoros </label>
        <TextInput
          type="number"
          bordered
          min="1"
          required
          v-model="formUpdateTask.estimatedPomodoros"
        />
      </div>
    </form>
    <template #modalAction>
      <div class="btn-controls flex justify-between w-full">
        <Button type="button" @click="handleClickDeleteTask">Delete</Button>
        <Button type="submit" color="primary" form="form-update-task">Update</Button>
      </div>
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
@/stores/settings/timer-setting
