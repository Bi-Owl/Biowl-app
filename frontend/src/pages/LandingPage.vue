<template>
  <HeroSection />
  <FeaturesSection />
  <TelegramCta />
  <TimelineSection />
</template>

<script setup>
import { onMounted } from 'vue';
import feather from 'feather-icons';
import HeroSection from '@/components/landing/HeroSection.vue';
import FeaturesSection from '@/components/landing/FeaturesSection.vue';
import TelegramCta from '@/components/landing/TelegramCta.vue';
// import TimelineSection from '@/components/landing/TimelineSection.vue';

onMounted(() => {
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
  });
  feather.replace();
});
</script>
