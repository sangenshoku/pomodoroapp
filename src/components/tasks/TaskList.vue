<script setup lang="ts">
import { Task } from '@/models/task';
import TaskItem from './TaskItem.vue';
import type { DeepReadonly } from 'vue';
import type { TaskOrReadonlyTask, TaskOrReadonlyTaskList } from '@/stores/tasks';

const selected = defineModel<Task | DeepReadonly<Task>>('selected');

defineProps<{
  tasks: TaskOrReadonlyTaskList;
}>();

const emits = defineEmits<{
  'click:edit': [task: TaskOrReadonlyTask];
  'toggle:done': [task: TaskOrReadonlyTask, isDone: boolean];
}>();

const handleClickTaskItem = (task: TaskOrReadonlyTask) => {
  selected.value = task;
};

const handleClickEditTaskIitem = (task: TaskOrReadonlyTask) => {
  emits('click:edit', task);
};

const handleToggleDone = (task: TaskOrReadonlyTask, isDone: boolean) => {
  emits('toggle:done', task, isDone);
};
</script>
<template>
  <div class="task-list grid gap-3">
    <TaskItem
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      :active="selected?.id === task.id"
      @click="handleClickTaskItem(task)"
      @click:edit="handleClickEditTaskIitem"
      @toggle:done="handleToggleDone"
    />
  </div>
</template>
