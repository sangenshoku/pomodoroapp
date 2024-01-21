<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <header class="p-4">
    <div class="brand text-2xl font-bold">
      <span>pom</span>
      <img src="@/assets/images/tomato-svgrepo-com.svg" class="w-5 inline" />
      <span>doro</span>
    </div>
  </header>
  <main class="container p-4">
    <RouterView />
  </main>
</template>
