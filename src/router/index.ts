import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  try {
    await authStore.checkAuth();
    const authRoutes = ['register', 'login'];

    if (authRoutes.includes(String(to.name)) && authStore.isAuthenticated) {
      return { name: 'home' };
    }
  } catch (err) {
    return true;
  }

  return true;
});

export default router;
