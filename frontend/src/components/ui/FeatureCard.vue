<template>
  <div
    class="p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover-scale glassmorphism"
    data-aos="fade-up"
  >
    <div
      class="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600"
    >
      <i :data-feather="icon" class="w-6 h-6"></i>
    </div>
    <div class="mt-6">
      <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
      <p class="mt-4 text-base text-gray-500">{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  icon: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.glassmorphism {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hover-scale {
  transition: transform 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.03);
}
</style>
