import axios from '@/http';
import { Task } from '@/models/task';
import type { TaskData, CreateTaskRequest, UpdateTaskRequest } from '@/models/task';
import {
  QueryClient,
  useMutation,
  useQuery,
  type UseMutationReturnType
} from '@tanstack/vue-query';
import { inject, toValue } from 'vue';

type DeleteQuery = { id?: string; params?: { done: boolean } } | null;

type CreateTaskMutation = UseMutationReturnType<
  Awaited<ReturnType<typeof createTask>>,
  Error,
  CreateTaskRequest,
  unknown
>;
type UpdateTaskMutation = UseMutationReturnType<
  Awaited<ReturnType<typeof updateTask>>,
  Error,
  UpdateTaskRequest,
  unknown
>;
type DeleteTaskMutation = UseMutationReturnType<
  Awaited<ReturnType<typeof deleteTasks>>,
  Error,
  DeleteQuery | undefined,
  unknown
>;
type TasksQuery = ReturnType<typeof useQuery<Task[]>>;

interface TaskServiceOptions {
  queryClient: QueryClient;
  tasksQuery: TasksQuery;
  mutations: {
    create: CreateTaskMutation;
    update: UpdateTaskMutation;
    delete: DeleteTaskMutation;
  };
}

const queryClient = inject<QueryClient>('queryClient')!;

export const getTasks = async () => {
  return await axios.get<TaskData[]>('/tasks');
};

export const createTask = (task: CreateTaskRequest) => {
  return axios.post<TaskData>('/tasks', task);
};

export const updateTask = (task: UpdateTaskRequest) => {
  const { id, ...rest } = task;
  return axios.put<TaskData>(`/tasks/${id}`, rest);
};

export const deleteTasks = (query: DeleteQuery = null) => {
  return axios.delete(`/tasks${query && query.id ? `/${query.id}` : ''}`, {
    params: query?.params
  });
};

export class TaskService {
  protected taskMutationCreate: CreateTaskMutation;
  protected taskMutationUpdate: UpdateTaskMutation;
  protected taskMutationDelete: DeleteTaskMutation;

  protected tasksQuery: ReturnType<typeof useQuery<Task[]>>;

  constructor(protected options: TaskServiceOptions) {
    this.taskMutationCreate = this.options.mutations.create;
    this.taskMutationUpdate = this.options.mutations.update;
    this.taskMutationDelete = this.options.mutations.delete;
    this.tasksQuery = this.options.tasksQuery;
  }

  get tasks() {
    return toValue(this.tasksQuery.data) ?? [];
  }

  async addTask(task: CreateTaskRequest) {
    return this.taskMutationCreate.mutateAsync(task);
  }

  async updateTask(task: UpdateTaskRequest) {
    return this.taskMutationUpdate.mutateAsync(task);
  }

  async deleteTask(id: string) {
    return this.taskMutationDelete.mutateAsync({ id });
  }

  async deleteAllTasks() {
    return this.taskMutationDelete.mutateAsync(null);
  }

  async deleteFinishedTasks() {
    return this.taskMutationDelete.mutateAsync({ params: { done: true } });
  }

  async getTasks() {
    await this.tasksQuery.refetch();
    return this.tasks;
  }

  hasTasks() {
    return !!this.tasks.length;
  }

  hasFinishedTasks() {
    return this.tasks.some((task) => task.done);
  }
}

export const useTaskService = () => {
  const tasksQuery = useQuery(
    {
      queryKey: ['tasks'],
      queryFn: getTasks,
      select: (response) => response.data.map((task) => new Task(task)),
      enabled: false
    },
    queryClient
  );

  const taskMutationCreate = useMutation({
    mutationFn: createTask,
    onSettled: async () => {
      await queryClient?.invalidateQueries({ queryKey: ['tasks'] });
      await tasksQuery.refetch();
    }
  });

  const taskMutationUpdate = useMutation({
    mutationFn: updateTask,
    onSettled: async () => {
      await queryClient?.invalidateQueries({ queryKey: ['tasks'] });
      await tasksQuery.refetch();
    }
  });

  const taskMutationDelete = useMutation({
    mutationFn: deleteTasks,
    onSettled: async () => {
      await queryClient?.invalidateQueries({ queryKey: ['tasks'] });
      await tasksQuery.refetch();
    }
  });

  return new TaskService({
    queryClient,
    tasksQuery,
    mutations: {
      create: taskMutationCreate,
      update: taskMutationUpdate,
      delete: taskMutationDelete
    }
  });
};
