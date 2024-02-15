import { describe, it, expect, vi } from 'vitest';
import { TaskService, createTask, deleteTasks, updateTask, getTasks } from '../task-service';
import { QueryClient, useMutation } from '@tanstack/vue-query';
import axios from '@/http';

vi.mock('@/http');
vi.mock('@tanstack/vue-query');

describe('TaskService', () => {
  describe('endpoints', async () => {
    it('should call getTasks', async () => {
      vi.mocked(axios, true).get.mockResolvedValue({
        data: [
          {
            id: '1',
            title: 'Test',
            completedPomodoros: 0,
            estimatedPomodoros: 1,
            done: false
          }
        ]
      });

      const { data } = await getTasks();

      expect(data).toHaveLength(1);
      expect(data).toContainEqual({
        id: '1',
        title: 'Test',
        completedPomodoros: 0,
        estimatedPomodoros: 1,
        done: false
      });
    });

    it('should call createTask', async () => {
      vi.mocked(axios, true).post.mockResolvedValue({
        data: {
          id: '1',
          title: 'Test',
          completedPomodoros: 0,
          estimatedPomodoros: 1,
          done: false
        }
      });

      const { data } = await createTask({
        title: 'Test',
        estimatedPomodoros: 1
      });

      expect(data).toMatchObject({
        id: '1',
        title: 'Test',
        completedPomodoros: 0,
        estimatedPomodoros: 1,
        done: false
      });
    });

    it('should call updateTask', async () => {
      vi.mocked(axios, true).put.mockResolvedValue({});

      const { data } = await updateTask({
        id: '1',
        title: 'Test',
        estimatedPomodoros: 1,
        completedPomodoros: 0,
        done: false
      });

      expect(data).toMatchObject({});
    });

    it('should call deleteTasks', async () => {
      vi.mocked(axios, true).delete.mockResolvedValue({});

      const { data } = await deleteTasks({ id: '1' });

      expect(data).toMatchObject({});
    });
  });

  it('should return tasks', async () => {
    const queryClient = new QueryClient();
    const tasksQuery = {
      data: [],
      refetch: vi.fn().mockImplementation(() => {
        tasksQuery.data = [
          {
            id: '1',
            title: 'Test',
            completedPomodoros: 0,
            estimatedPomodoros: 1,
            done: false
          },
          {
            id: '2',
            title: 'Test 2',
            completedPomodoros: 1,
            estimatedPomodoros: 1,
            done: true
          }
        ];
      })
    } as any;

    const taskCreateMutation = useMutation({
      mutationFn: createTask
    });

    const taskUpdateMutation = useMutation({
      mutationFn: updateTask
    });

    const taskDeleteMutation = useMutation({
      mutationFn: deleteTasks
    });

    const taskService = new TaskService({
      queryClient,
      tasksQuery,
      mutations: {
        create: taskCreateMutation,
        update: taskUpdateMutation,
        delete: taskDeleteMutation
      }
    });

    const tasks = await taskService.getTasks();

    expect(tasks).toHaveLength(2);
    expect(tasks).toContainEqual({
      id: '1',
      title: 'Test',
      completedPomodoros: 0,
      estimatedPomodoros: 1,
      done: false
    });
    expect(tasks).toContainEqual({
      id: '2',
      title: 'Test 2',
      completedPomodoros: 1,
      estimatedPomodoros: 1,
      done: true
    });

    expect(taskService.hasFinishedTasks()).toBe(true);
    expect(taskService.hasTasks()).toBe(true);
  });

  it('should return false if there are no tasks', async () => {
    const queryClient = new QueryClient();
    const tasksQuery = {
      data: [],
      refetch: vi.fn().mockImplementation(() => {
        tasksQuery.data = [];
      })
    } as any;

    const taskCreateMutation = useMutation({
      mutationFn: createTask
    });

    const taskUpdateMutation = useMutation({
      mutationFn: updateTask
    });

    const taskDeleteMutation = useMutation({
      mutationFn: deleteTasks
    });

    const taskService = new TaskService({
      queryClient,
      tasksQuery,
      mutations: {
        create: taskCreateMutation,
        update: taskUpdateMutation,
        delete: taskDeleteMutation
      }
    });

    const hasTasks = taskService.hasTasks();

    expect(hasTasks).toBe(false);
  });

  it('should return false if there are no finished tasks', async () => {
    const queryClient = new QueryClient();
    const tasksQuery = {
      data: [],
      refetch: vi.fn().mockImplementation(() => {
        tasksQuery.data = [
          {
            id: '1',
            title: 'Test',
            completedPomodoros: 0,
            estimatedPomodoros: 1,
            done: false
          }
        ];
      })
    } as any;

    const taskCreateMutation = useMutation({
      mutationFn: createTask
    });

    const taskUpdateMutation = useMutation({
      mutationFn: updateTask
    });

    const taskDeleteMutation = useMutation({
      mutationFn: deleteTasks
    });

    const taskService = new TaskService({
      queryClient,
      tasksQuery,
      mutations: {
        create: taskCreateMutation,
        update: taskUpdateMutation,
        delete: taskDeleteMutation
      }
    });

    const hasFinishedTasks = taskService.hasFinishedTasks();

    expect(hasFinishedTasks).toBe(false);
  });

  it('should call addTask', async () => {
    const queryClient = new QueryClient();
    const tasksQuery = {
      data: [],
      refetch: vi.fn().mockImplementation(() => {
        tasksQuery.data = [
          {
            id: '1',
            title: 'Test',
            completedPomodoros: 0,
            estimatedPomodoros: 1,
            done: false
          }
        ];
      })
    } as any;

    const taskCreateMutation = {
      mutateAsync: vi.fn().mockResolvedValue({})
    } as any;

    const taskUpdateMutation = useMutation({
      mutationFn: updateTask
    });

    const taskDeleteMutation = useMutation({
      mutationFn: deleteTasks
    });

    const taskService = new TaskService({
      queryClient,
      tasksQuery,
      mutations: {
        create: taskCreateMutation,
        update: taskUpdateMutation,
        delete: taskDeleteMutation
      }
    });

    await taskService.addTask({
      title: 'Test',
      estimatedPomodoros: 1
    });

    expect(taskCreateMutation.mutateAsync).toHaveBeenCalledWith({
      title: 'Test',
      estimatedPomodoros: 1
    });
  });

  it('should call updateTask', async () => {
    const queryClient = new QueryClient();
    const tasksQuery = {
      data: [],
      refetch: vi.fn().mockImplementation(() => {
        tasksQuery.data = [
          {
            id: '1',
            title: 'Test',
            completedPomodoros: 0,
            estimatedPomodoros: 1,
            done: false
          }
        ];
      })
    } as any;

    const taskCreateMutation = useMutation({
      mutationFn: createTask
    });

    const taskUpdateMutation = {
      mutateAsync: vi.fn().mockResolvedValue({})
    } as any;

    const taskDeleteMutation = useMutation({
      mutationFn: deleteTasks
    });

    const taskService = new TaskService({
      queryClient,
      tasksQuery,
      mutations: {
        create: taskCreateMutation,
        update: taskUpdateMutation,
        delete: taskDeleteMutation
      }
    });

    await taskService.updateTask({
      id: '1',
      title: 'Test',
      estimatedPomodoros: 1,
      completedPomodoros: 0,
      done: false
    });

    expect(taskUpdateMutation.mutateAsync).toHaveBeenCalledWith({
      id: '1',
      title: 'Test',
      estimatedPomodoros: 1,
      completedPomodoros: 0,
      done: false
    });
  });

  it('should call deleteTask', async () => {
    const queryClient = new QueryClient();
    const tasksQuery = {
      data: [],
      refetch: vi.fn().mockImplementation(() => {
        tasksQuery.data = [
          {
            id: '1',
            title: 'Test',
            completedPomodoros: 0,
            estimatedPomodoros: 1,
            done: false
          }
        ];
      })
    } as any;

    const taskCreateMutation = useMutation({
      mutationFn: createTask
    });

    const taskUpdateMutation = useMutation({
      mutationFn: updateTask
    });

    const taskDeleteMutation = {
      mutateAsync: vi.fn().mockResolvedValue({})
    } as any;

    const taskService = new TaskService({
      queryClient,
      tasksQuery,
      mutations: {
        create: taskCreateMutation,
        update: taskUpdateMutation,
        delete: taskDeleteMutation
      }
    });

    await taskService.deleteTask('1');

    expect(taskDeleteMutation.mutateAsync).toHaveBeenCalledWith({ id: '1' });
  });
});
