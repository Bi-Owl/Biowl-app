<template>
  <div id="app-wrapper" class="flex flex-col min-h-screen">
    <Background />
    <Header v-if="showLayout" />
    <main 
      class="flex-grow w-full" 
      :class="{ 
        'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8': !isDashboardRoute,
        'pt-32': showLayout 
      }"
    >
      <router-view />
    </main>
    <Footer v-if="showLayout" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Background from './components/layout/Background.vue';
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';

const route = useRoute();
const isDashboardRoute = computed(() => route.name === 'Dashboard');
const showLayout = computed(() => !isDashboardRoute.value && route.name !== 'Auth');
</script>