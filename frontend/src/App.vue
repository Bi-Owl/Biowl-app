<template>
  <div id="app-wrapper" class="flex flex-col min-h-screen">
    <Background />
    <Header v-if="showLayout" />
    <main 
      class="flex-grow w-full" 
      :class="{ 
        'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8': !isFullWidthRoute,
        'pt-32': showLayout 
      }"
    >
      <router-view />
      <ModalsContainer />
    </main>
    <Footer v-if="showLayout" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ModalsContainer } from 'vue-final-modal';
import Background from './components/layout/Background.vue';
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';

const route = useRoute();
const isDashboardRoute = computed(() => route.name === 'Dashboard');
const isFullWidthRoute = computed(() => {
  return route.name === 'Dashboard' || route.name === 'AdminDashboard';
});
const showLayout = computed(() => {
  const adminRoutes = ['AdminLogin', 'AdminDashboard'];
  return !isDashboardRoute.value && route.name !== 'Auth' && !adminRoutes.includes(route.name);
});
</script>