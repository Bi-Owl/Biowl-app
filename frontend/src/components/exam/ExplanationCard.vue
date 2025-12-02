<template>
  <div class="bg-white rounded-3xl shadow-lg border border-gray-100/80 p-6 transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-gray-200">
    <h3 class="flex items-center text-lg font-bold text-blue-800 mb-6">
      <span class="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center me-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
      </span>
      توضیحات
    </h3>
    <div>
      <img
        v-if="explanation.imageUrl"
        :src="STATIC_BASE_URL + explanation.imageUrl"
        alt="تصویر توضیحات"
        class="w-full h-auto rounded-lg object-contain"
      />
    </div>
  </div>
</template>

<script setup>
import { STATIC_BASE_URL } from '@/config/api';

defineProps({
  explanation: {
    type: Object,
    required: true,
  },
});
</script>
