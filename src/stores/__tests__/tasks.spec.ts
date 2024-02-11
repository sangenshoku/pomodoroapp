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

  describe('update task', () => {
    it('should not update a readonly task directly', () => {
      const store = useTasksStore();

      store.addTask({ title: 'Task 1', estimatedPomodoros: 1 });

      const task = store.tasks[0];

      expect(task.done).toEqual(false);

      task.markAsDone();

      expect(task.done).toEqual(false);

      store.updateTask(task);

      expect(store.tasks[0].done).toEqual(false);
    });

    it('should update a readonly task by cloning', () => {
      const store = useTasksStore();

      store.addTask({ title: 'Task 1', estimatedPomodoros: 1 });

      const cloned = store.tasks[0].clone();

      cloned.title = 'Task Updated';
      cloned.incrementCompletedPomodoros();
      cloned.markAsDone();

      expect(cloned.done).toEqual(true);

      store.updateTask(cloned);

      expect(store.tasks[0].title).toEqual('Task Updated');
      expect(store.tasks[0].done).toEqual(true);
      expect(store.tasks[0].completedPomodoros).toEqual(1);
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

    it('should delete a task', () => {
      const store = useTasksStore();

      store.addTask({ title: 'Task 1', estimatedPomodoros: 0 });
      store.addTask({ title: 'Task 2', estimatedPomodoros: 0 });

      store.deleteTask(store.tasks[0].id);

      expect(store.tasks).toHaveLength(1);
      expect(store.tasks[0].title).toEqual('Task 2');
    });

    it('should delete all finished tasks', () => {
      const store = useTasksStore();

      store.addTask({ title: 'Task 1', estimatedPomodoros: 0 });
      store.addTask({ title: 'Task 2', estimatedPomodoros: 0 });

      const cloned = store.tasks[0].clone().markAsDone();

      store.updateTask(cloned);
      store.deleteFinishedTasks();

      expect(store.tasks).toHaveLength(1);
      expect(store.tasks[0].title).toEqual('Task 2');
    });
  });
});
