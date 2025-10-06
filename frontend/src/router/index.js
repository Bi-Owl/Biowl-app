import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../pages/LandingPage.vue';
import AuthPage from '../pages/AuthPage.vue';
import DashboardPage from '../pages/DashboardPage.vue';
import { auth } from '../auth';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage,
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthPage,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // Wait for the initial auth check to complete if it hasn't already
  if (!auth.state.isAuthCheckComplete) {
    await auth.checkAuth();
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = auth.isAuthenticated();

  if (requiresAuth && !isAuthenticated) {
    next('/auth');
  } else if (to.name === 'Auth' && isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
