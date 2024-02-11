<script setup lang="ts">
import { onMounted, onUpdated, ref, toValue } from 'vue';
import Button from './Button.vue';

const visible = defineModel('visible', { default: false, required: true, type: Boolean });
const props = defineProps<{ header?: string }>();

const dialog = ref<HTMLDialogElement | null>(null);

const handleInitDialog = () => {
  dialog.value?.addEventListener('close', () => {
    visible.value = false;
  });

  if (toValue(visible)) {
    dialog.value?.showModal();
  } else {
    dialog.value?.close();
  }
};

onUpdated(() => {
  handleInitDialog();
});

onMounted(() => {
  handleInitDialog();
});
</script>
<template>
  <dialog class="modal" ref="dialog" v-if="visible" :aria-labelledby="props.header">
    <div class="modal-box max-w-md">
      <div class="modal-header flex justify-between items-center mb-5">
        <h3 class="font-bold text-lg" :id="props.header">{{ props.header }}</h3>
        <form method="dialog">
          <Button size="small" shape="circle">
            <span class="bi bi-x-lg"></span>
          </Button>
        </form>
      </div>
      <slot></slot>
      <div class="modal-action">
        <slot name="modalAction"></slot>
      </div>
    </div>
  </dialog>
</template>
<style scoped></style>
