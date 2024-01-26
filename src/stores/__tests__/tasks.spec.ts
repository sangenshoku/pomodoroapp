import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach } from 'vitest';
import { useTasksStore } from '../tasks';

describe('useTasksStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('add task', () => {
    it('should add a task', () => {
      const store = useTasksStore();

      store.addTask({ title: 'Task 1', estimatedPomodoros: 1 });

      expect(store.tasks[0].title).toEqual('Task 1');
      expect(store.tasks[0].estimatedPomodoros).toEqual(1);
      expect(store.tasks).toHaveLength(1);
    });

    it('should not add a task if title is empty', () => {
      const store = useTasksStore();

      store.addTask({ title: '', estimatedPomodoros: 0 });

      expect(store.tasks).toHaveLength(0);
    });
  });

  describe('delete task', () => {
    it('should delete all tasks', () => {
      const store = useTasksStore();

      store.addTask({ title: 'Task 1', estimatedPomodoros: 0 });
      store.addTask({ title: 'Task 2', estimatedPomodoros: 0 });

      store.deleteAllTasks();

      expect(store.tasks).toHaveLength(0);
    });
  });
});
