<script setup lang="ts">
import { defineModel, onMounted, ref } from 'vue';

interface TextInputProps {
  type?: 'text' | 'number' | 'email' | 'password';
  placeholder?: string;
  size?: 'extra-small' | 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
  bordered?: boolean;
  ghost?: boolean;
  focused?: boolean;
}

const model = defineModel<string | number>();

const props = withDefaults(defineProps<TextInputProps>(), {
  type: 'text',
  placeholder: '',
  size: 'medium',
  border: true,
  focused: false
});

const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  if (props.focused) {
    inputRef.value?.focus();
  }
});
</script>
<template>
  <input
    v-model="model"
    ref="inputRef"
    :type="props.type"
    :placeholder="props.placeholder"
    :class="[
      'input w-full',
      {
        'input-xs': props.size === 'extra-small',
        'input-sm': props.size === 'small',
        'input-lg': props.size === 'large',
        'input-primary': props.color === 'primary',
        'input-secondary': props.color === 'secondary',
        'input-accent': props.color === 'accent',
        'input-success': props.color === 'success',
        'input-error': props.color === 'error',
        'input-warning': props.color === 'warning',
        'input-info': props.color === 'info',
        'input-bordered': props.bordered,
        'input-ghost': props.ghost
      }
    ]"
    data-testid="text-input"
  />
</template>
