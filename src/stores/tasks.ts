import { defineStore } from 'pinia';
import { computed, readonly, ref, type DeepReadonly, type Ref } from 'vue';
import { Task, type TaskData } from '@/models/task';
import { v4 as uuidv4 } from 'uuid';

export type TaskAdd = Pick<TaskData, 'title' | 'estimatedPomodoros'>;
export type TaskUpdate = Pick<TaskData, 'id'> & Partial<Omit<TaskData, 'id'>>;
export type TaskOrReadonlyTask = Task | DeepReadonly<Task>;
export type TaskOrReadonlyTaskList = Task[] | DeepReadonly<Task[]>;

export const useTasksStore = defineStore('tasks', () => {
  // explicitly define using Ref type because it's being inferred as ordinary object of array
  const _tasks: Ref<Map<string, Task>> = ref(new Map());

  const tasks = computed(() => readonly([..._tasks.value.values()]));
  const hasTasks = computed(() => _tasks.value.size > 0);
  const hasFinishedTasks = computed(() => tasks.value.some((task) => task.done));

  const addTask = (task: TaskAdd) => {
    if (!isValid(task)) return;

    const id = uuidv4();
    const newTask = new Task({
      ...task,
      id,
      completedPomodoros: 0,
      done: false
    });

    _tasks.value.set(id, newTask);
  };

  const updateTask = (task: TaskUpdate) => {
    const foundTask = _tasks.value.get(task.id);
    if (!foundTask) return;

    foundTask.updateFrom(task);
  };

  const deleteTask = (id: string) => {
    _tasks.value.delete(id);
  };

  const deleteAllTasks = () => {
    _tasks.value.clear();
  };

  const deleteFinishedTasks = () => {
    tasks.value.filter(({ done }) => done).forEach(({ id }) => _tasks.value.delete(id));
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
    hasTasks,
    hasFinishedTasks,
    deleteFinishedTasks
  };
});
