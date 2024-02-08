import { defineStore } from 'pinia';
import { computed, readonly, ref, type DeepReadonly, type Ref } from 'vue';
import { Task, type TaskData } from '@/models/task';

export type TaskAdd = Pick<TaskData, 'title' | 'estimatedPomodoros'>;
export type TaskUpdate = Pick<TaskData, 'id'> & Partial<Omit<TaskData, 'id'>>;
export type TaskOrReadonlyTask = Task | DeepReadonly<Task>;
export type TaskOrReadonlyTaskList = Task[] | DeepReadonly<Task[]>;

export const useTasksStore = defineStore('tasks', () => {
  // explicitly define using Ref type because it's being inferred as ordinary object of array
  const _tasks: Ref<Task[]> = ref([]);

  const tasks = readonly(_tasks);
  const hasTasks = computed(() => _tasks.value.length > 0);

  const addTask = (task: TaskAdd) => {
    task = { ...task };

    if (!isValid(task)) return;

    const newTask = new Task({
      ...task,
      id: Date.now().toString(),
      completedPomodoros: 0,
      done: false
    });

    _tasks.value.push(newTask);
  };

  const updateTask = (task: TaskUpdate) => {
    const foundTask = _tasks.value.find((t) => t.id === task.id);
    if (!foundTask) return;

    foundTask.updateFrom(task);
  };

  const deleteTask = (id: string) => {
    _tasks.value = _tasks.value.filter((task) => task.id !== id);
  };

  const deleteAllTasks = () => {
    _tasks.value.length = 0;
  };

  const isValid = (task: TaskAdd | TaskUpdate) => {
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
