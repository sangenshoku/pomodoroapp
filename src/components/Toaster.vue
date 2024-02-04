<script setup lang="ts">
import { useToastNotificationStore } from '@/stores/toast-notification';

const notificationStore = useToastNotificationStore();
</script>
<template>
  <Teleport to="#app">
    <div class="toast toast-top toast-end" data-testid="toaster">
      <div
        :class="[
          'alert text-white',
          {
            'alert-success': notification.status === 'success',
            'alert-error': notification.status === 'error',
            'alert-info': notification.status === 'info'
          }
        ]"
        v-for="[key, notification] in notificationStore.notifications"
        :key="key"
      >
        {{ notification.message }}
      </div>
    </div>
  </Teleport>
</template>
