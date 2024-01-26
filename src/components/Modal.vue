<script setup lang="ts">
import { onMounted, onUpdated, ref, toValue } from 'vue';

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
  <dialog class="modal" ref="dialog" v-if="visible">
    <div class="modal-box max-w-md">
      <div class="modal-header flex justify-between items-center mb-5">
        <h3 class="font-bold text-lg">{{ props.header }}</h3>
        <form method="dialog">
          <button class="btn btn-sm btn-circle">
            <span class="bi bi-x-lg"></span>
          </button>
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
