<script setup lang="ts">
import { computed, shallowReactive, shallowRef, toValue, watch } from 'vue';
import TextInput from '@/components/TextInput.vue';
import Button from '@/components/Button.vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { axiosErrorHandler } from '@/http';
import { useToastNotificationStore } from '@/stores/toast-notification';
import type { RegisterRequest } from '@/services/auth-service';

export interface RegisterResponseError {
  description: string;
  errors: {
    code: string;
    description: string;
  }[];
}

const authStore = useAuthStore();
const router = useRouter();
const notificationStore = useToastNotificationStore();

const formRegister = shallowReactive<RegisterRequest>({
  email: '',
  password: '',
  confirmPassword: ''
});

const error = shallowRef<RegisterResponseError | undefined>();
const firstError = computed(() => error.value?.errors[0]);

watch(formRegister, () => {
  resetError();
});

const handleSubmit = async (event: Event) => {
  event.preventDefault();

  resetError();

  authStore
    .register(toValue(formRegister))
    .then(() => {
      notificationStore.addSuccessNotification('Registered Successfully.');
      router.push({ name: 'login' });
    })
    .catch(
      axiosErrorHandler<RegisterResponseError>((res) => {
        if (res.type === 'axios-error') {
          error.value = res.error.response?.data;
        }
      })
    );
};

const resetError = () => {
  error.value = undefined;
};
</script>
<template>
  <div class="card grid gap-5 bg-white p-7 sm:p-10 main-wrapper m-auto">
    <div class="register-contaie">
      <h3 class="text-lg font-bold text-center">Register</h3>
      <form class="grid gap-5 mb-5" id="form-register" @submit.enter="handleSubmit">
        <div class="form-control">
          <label for="email" class="label"> Email </label>
          <TextInput
            id="email"
            type="email"
            placeholder="hello@example.com"
            :color="firstError ? 'error' : undefined"
            required
            v-model="formRegister.email"
          />
        </div>
        <div class="form-control">
          <label for="password" class="label"> Password </label>
          <TextInput
            id="password"
            type="password"
            :color="firstError ? 'error' : undefined"
            required
            v-model="formRegister.password"
          />
        </div>
        <div class="form-control">
          <label for="confirm-password" class="label"> Confirm Password </label>
          <TextInput
            id="confirm-password"
            type="password"
            :color="firstError ? 'error' : undefined"
            required
            v-model="formRegister.confirmPassword"
          />
        </div>
        <div role="alert" class="alert alert-error" v-if="firstError">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{{ firstError?.description }}</span>
        </div>
      </form>
      <Button
        type="submit"
        class="btn-login w-full"
        size="large"
        color="primary"
        form="form-register"
        :loading="authStore.isLoading('register')"
      >
        Register
      </Button>
    </div>
    <div class="other-link-container">
      <p class="text-center">
        Already have an account?
        <router-link :to="{ name: 'login' }" class="link">Login</router-link>
      </p>
    </div>
  </div>
</template>
