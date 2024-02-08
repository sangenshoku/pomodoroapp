<script setup lang="ts">
import { ref, watch } from 'vue';
import Button from '@/components/Button.vue';
import type { TaskOrReadonlyTask } from '@/stores/tasks';

interface TaskItemProps {
  task: TaskOrReadonlyTask;
  active?: boolean;
}

const props = withDefaults(defineProps<TaskItemProps>(), {
  active: false
});

const emits = defineEmits<{
  'click:edit': [task: TaskOrReadonlyTask];
  'toggle:done': [task: TaskOrReadonlyTask, isDone: boolean];
}>();

const checkboxModel = ref(props.task.done);

watch(checkboxModel, (done) => {
  emits('toggle:done', props.task, done);
});

const handleCheck = (event: Event) => {
  event.stopPropagation();
};

const handleClickEdit = (event: Event) => {
  event.stopPropagation();
  emits('click:edit', props.task);
};
</script>
<template>
  <div
    class="task-item card w-full bg-base-100"
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
        <div class="more-details flex gap-3 items-center">
          <span class="text-sm"
            >{{ props.task.completedPomodoros }} / {{ props.task.estimatedPomodoros }}</span
          >
          <Button shape="square" size="extra-small" outlined @click="handleClickEdit">
            <span class="bi bi-three-dots-vertical"></span>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.task-item {
  border-left: 6px solid transparent;
  color: grey;
}

.task-item:hover {
  cursor: pointer;
  border-left: 6px solid rgb(204, 204, 204);
}

.task-item .checkbox {
  --chkbg: grey !important;
}

[data-active='true'] {
  border-left: 6px solid grey;
}

button {
  color: grey;
  border-color: grey;
}

button:hover {
  color: #fff;
  background-color: gray;
  border-color: #fff;
}
</style>
