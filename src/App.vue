<template>
  <div id="app-wrapper" class="flex flex-col min-h-screen">
    <Header />
    <main class="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <LandingPage />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';
import LandingPage from './pages/LandingPage.vue';
</script>
