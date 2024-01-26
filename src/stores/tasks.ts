import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export interface Task {
  id: string;
  title: string;
  completedPomodoros: number;
  estimatedPomodoros: number;
  done?: boolean;
}

export type TaskAdd = Omit<Task, 'id' | 'completedPomodoros'>;

export const useTasksStore = defineStore('tasks', () => {
  const _tasks = ref<Task[]>([]);

  const tasks = computed(() => _tasks.value);
  const hasTasks = computed(() => _tasks.value.length > 0);

  const addTask = (task: TaskAdd) => {
    task = { ...task };

    if (!isValid(task)) return;

    const newTask = { ...task, id: Date.now().toString(), completedPomodoros: 0 };
    _tasks.value.push(newTask);
  };

  const updateTask = (task: Task) => {
    task = { ...task };

    if (!isValid(task)) return;

    const index = _tasks.value.findIndex((t) => t.id === task.id);
    if (index === -1) return;
    _tasks.value[index] = task;
  };

  const deleteTask = (id: string) => {
    _tasks.value = _tasks.value.filter((task) => task.id !== id);
  };

  const deleteAllTasks = () => {
    _tasks.value.length = 0;
  };

  const isValid = (task: Task | TaskAdd) => {
    for (const [key, value] of Object.entries(task)) {
      if (!value && value !== 0 && key !== 'id') return false;
    }
    return true;
  };

  return {
    tasks,
    addTask,
    deleteTask,
    updateTask,
    deleteAllTasks,
    hasTasks
  };
});
