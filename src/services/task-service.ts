import axios from '@/http';
import { Task } from '@/models/task';
import type { TaskData, CreateTaskRequest, UpdateTaskRequest } from '@/models/task';
import { QueryClient, useMutation, useQuery } from '@tanstack/vue-query';
import { inject, toValue } from 'vue';

type DeleteQuery = { id?: string; params?: { done: boolean } } | null;

const getTasks = async () => {
  return await axios.get<TaskData[]>('/tasks');
};

const createTask = (task: CreateTaskRequest) => {
  return axios.post<TaskData>('/tasks', task);
};

const updateTask = (task: UpdateTaskRequest) => {
  const { id, ...rest } = task;
  return axios.put<TaskData>(`/tasks/${id}`, rest);
};

const deleteTasks = (query: DeleteQuery = null) => {
  return axios.delete(`/tasks${query && query.id ? `/${query.id}` : ''}`, {
    params: query?.params
  });
};

// const refetchTasksQuery = async (
//   queryClient: QueryClient,
//   tasksQuery: ReturnType<typeof useQuery>
// ) => {
//   await queryClient?.invalidateQueries({ queryKey: ['tasks'] });
//   tasksQuery.refetch();
// };

export class TaskService {
  protected taskMutationCreate: ReturnType<typeof useMutation<unknown, unknown, CreateTaskRequest>>;
  protected taskMutationUpdate: ReturnType<typeof useMutation<unknown, unknown, UpdateTaskRequest>>;
  protected taskMutationDelete: ReturnType<
    typeof useMutation<unknown, unknown, DeleteQuery | undefined>
  >;

  protected tasksQuery: ReturnType<typeof useQuery<Task[]>>;

  constructor() {
    const queryClient = inject<QueryClient>('queryClient');

    this.taskMutationCreate = useMutation({
      mutationFn: createTask,
      onSettled: async () => {
        await queryClient?.invalidateQueries({ queryKey: ['tasks'] });
        await this.tasksQuery.refetch();
      }
    });

    this.taskMutationUpdate = useMutation({
      mutationFn: updateTask,
      onSettled: async () => {
        await queryClient?.invalidateQueries({ queryKey: ['tasks'] });
        await this.tasksQuery.refetch();
      }
    });

    this.taskMutationDelete = useMutation({
      mutationFn: deleteTasks,
      onSettled: async () => {
        await queryClient?.invalidateQueries({ queryKey: ['tasks'] });
        await this.tasksQuery.refetch();
      }
    });

    this.tasksQuery = useQuery(
      {
        queryKey: ['tasks'],
        queryFn: getTasks,
        select: (response) => response.data.map((task) => new Task(task)),
        enabled: false
      },
      queryClient
    );
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
    return !!toValue(this.tasks)?.length;
  }
}
