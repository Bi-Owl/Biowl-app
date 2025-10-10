import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../pages/LandingPage.vue';
import AuthPage from '../pages/AuthPage.vue';
import DashboardPage from '../pages/DashboardPage.vue';
import AdminLoginPage from '../pages/AdminLoginPage.vue';
import AdminDashboardPage from '../pages/AdminDashboardPage.vue';
import { auth } from '../auth';
import { adminAuth } from '../adminAuth';

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
  {
    path: '/admin',
    name: 'AdminLogin',
    component: AdminLoginPage,
  },
  {
    path: '/admin-panel',
    name: 'AdminDashboard',
    component: AdminDashboardPage,
    meta: { requiresAdminAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // Wait for the initial auth checks to complete
  if (!auth.state.isAuthCheckComplete) {
    await auth.checkAuth();
  }
  if (!adminAuth.state.isAdminAuthCheckComplete) {
    await adminAuth.checkAuth();
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = auth.isAuthenticated();

  const requiresAdminAuth = to.matched.some(record => record.meta.requiresAdminAuth);
  const isAdminAuthenticated = adminAuth.isAuthenticated();

  if (requiresAuth && !isAuthenticated) {
    next('/auth');
  } else if (to.name === 'Auth' && isAuthenticated) {
    next('/dashboard');
  } else if (requiresAdminAuth && !isAdminAuthenticated) {
    next('/admin');
  } else if (to.name === 'AdminLogin' && isAdminAuthenticated) {
    next('/admin-panel');
  } else {
    next();
  }
});

export default router;
