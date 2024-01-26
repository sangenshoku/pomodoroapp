<script setup lang="ts">
import type { Task } from '@/stores/tasks';
import { ref } from 'vue';

interface TaskItemProps {
  task: Task;
  active?: boolean;
}

const props = withDefaults(defineProps<TaskItemProps>(), {
  active: false
});

const checkboxModel = ref(props.task.done);

const handleCheck = (event: Event) => {
  event.stopPropagation();
};
</script>
<template>
  <div
    class="task-item card w-full bg-base-100 shadow"
    :data-active="props.active"
    data-testid="task-item"
  >
    <div class="card-body p-5">
      <div class="flex gap-3 items-center justify-between">
        <div class="inline-flex gap-3 items-center">
          <input
            type="checkbox"
            class="checkbox"
            v-model="checkboxModel"
            @click="handleCheck($event)"
          />
          <span :class="{ 'line-through': checkboxModel }">{{ props.task.title }}</span>
        </div>
        <span class="text-sm"
          >{{ props.task.completedPomodoros }} / {{ props.task.estimatedPomodoros }}</span
        >
      </div>
    </div>
  </div>
</template>
<style scoped>
.task-item:hover {
  cursor: pointer;
}
[data-active='true'] {
  border: solid 1px gray;
}
</style>
