<script setup lang="ts">
import { computed, shallowReactive, shallowRef, toValue, watch } from 'vue';
import TextInput from '@/components/TextInput.vue';
import Button from '@/components/Button.vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { axiosErrorHandler } from '@/http';

interface LoginResponseError {
  code: string;
  description: string;
}

const authStore = useAuthStore();
const router = useRouter();

const formLogin = shallowReactive({
  email: '',
  password: ''
});

const error = shallowRef<LoginResponseError | undefined>();
const isErrorInvalidCredentials = computed(() => error.value?.code === 'auth.invalid_credentials');

watch(formLogin, () => {
  resetError();
});

const handleSubmit = async (event: Event) => {
  event.preventDefault();

  resetError();

  authStore
    .login(toValue(formLogin))
    .then(() => {
      router.push({ name: 'home' });
    })
    .catch(
      axiosErrorHandler<LoginResponseError>((res) => {
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
  <div class="card grid gap-5 bg-white p-10 main-wrapper m-auto">
    <div class="login-container">
      <h3 class="text-lg font-bold text-center">Login</h3>
      <form class="grid gap-5 mb-5" id="form-login" @submit.enter="handleSubmit">
        <div class="form-control">
          <label for="email" class="label"> Email </label>
          <TextInput
            id="email"
            type="email"
            placeholder="hello@example.com"
            :color="isErrorInvalidCredentials ? 'error' : undefined"
            required
            v-model="formLogin.email"
          />
        </div>
        <div class="form-control">
          <label for="password" class="label"> Password </label>
          <TextInput
            id="password"
            type="password"
            :color="isErrorInvalidCredentials ? 'error' : undefined"
            required
            v-model="formLogin.password"
          />
        </div>
        <div role="alert" class="alert alert-error" v-if="isErrorInvalidCredentials">
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
          <span>{{ error?.description }}</span>
        </div>
      </form>
      <Button type="submit" class="btn-login w-full" size="large" color="primary" form="form-login">
        Login
      </Button>
    </div>
    <div class="other-link-container">
      <p class="text-center">
        Don't have an account?
        <router-link :to="{ name: 'register' }" class="link">Register</router-link>
      </p>
    </div>
  </div>
</template>
