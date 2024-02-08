import './assets/main.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';

const app = createApp(App);

app.use(createPinia());
app.use(router);

// I get this error: `Error: vue-query hooks can only be used inside setup()`
// whenever I try to directly import the service classes that use the tanstack query
const queryClient = new QueryClient();

app.use(VueQueryPlugin, { queryClient });
app.provide('queryClient', queryClient);

app.mount('#app');
