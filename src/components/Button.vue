<script setup lang="ts">
export interface ButtonProps {
  size?: 'extra-small' | 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'warning' | 'info';
  ghost?: boolean;
  shape?: 'circle' | 'square';
  outlined?: boolean;
  wide?: boolean;
  glass?: boolean;
  default?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  size: 'medium'
});
</script>
<template>
  <button
    :class="[
      'btn',
      {
        'btn-xs': size === 'extra-small',
        'btn-sm': size === 'small',
        'btn-lg': size === 'large',
        'btn-primary': color === 'primary',
        'btn-secondary': color === 'secondary',
        'btn-accent': color === 'accent',
        'btn-success': color === 'success',
        'btn-error': color === 'error',
        'btn-warning': color === 'warning',
        'btn-info': color === 'info',
        'btn-ghost': ghost,
        'btn-circle': shape === 'circle',
        'btn-square': shape === 'square',
        'btn-outline': outlined,
        'btn-wide': wide,
        'btn-default': props.default,
        glass: glass
      }
    ]"
    data-testid="button"
  >
    <slot></slot>
  </button>
</template>
<style scoped>
.btn-default {
  background-color: var(--color-black-alpha-2);
  color: var(--pomo-text-color);
  border: none;
}
</style>
