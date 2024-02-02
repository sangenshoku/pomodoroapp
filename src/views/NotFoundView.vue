<script setup lang="ts">
import Button from '@/components/Button.vue';
</script>
<template>
  <div class="not-found-container flex items-center justify-center">
    <div class="grid gap-3 justify-items-center text-white h-100">
      <h1 class="text-4xl font-bold">You can't seem to focus.</h1>
      <h3 class="text-2xl font-bold">Let's get back on track!</h3>
      <Button default @click="$router.push({ name: 'home' })">Go to Home</Button>
    </div>
  </div>
</template>
<style scoped>
.not-found-container {
  min-height: inherit;
}
</style>
