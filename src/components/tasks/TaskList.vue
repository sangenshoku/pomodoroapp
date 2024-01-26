<script setup lang="ts">
import type { Task } from '@/stores/tasks';
import TaskItem from './TaskItem.vue';

const selected = defineModel<Task>('selected');

defineProps<{
  tasks: Task[];
}>();

const handleClickTaskItem = (task: Task) => {
  selected.value = task;
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
    />
  </div>
</template>
