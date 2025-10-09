<template>
  <div class="border rounded-lg p-4 shadow-sm bg-white flex flex-col h-full">
    <div class="flex-grow">
      <h3 class="text-lg font-semibold mb-2">{{ exam.name }}</h3>
      <p class="text-gray-600 text-sm mb-4">{{ exam.description }}</p>
    </div>
    <div class="mt-4 text-sm text-gray-500">
      <div class="flex justify-between items-center">
        <span>قیمت:</span>
        <span class="font-bold" :class="isFree ? 'text-green-600' : 'text-gray-800'">
          {{ priceText }}
        </span>
      </div>
      <div v-if="exam.startTime" class="flex justify-between items-center mt-2">
        <span>زمان شروع:</span>
        <span>{{ new Date(exam.startTime).toLocaleString('fa-IR') }}</span>
      </div>
      <div v-if="exam.endTime" class="flex justify-between items-center mt-1">
        <span>زمان پایان:</span>
        <span>{{ new Date(exam.endTime).toLocaleString('fa-IR') }}</span>
      </div>
    </div>
    <div class="mt-6">
      <slot name="action-button"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  exam: {
    type: Object,
    required: true,
  },
});

const isFree = computed(() => props.exam.price === 'free');

const priceText = computed(() => {
  if (isFree.value) {
    return 'رایگان';
  }
  return `${Number(props.exam.price).toLocaleString('fa-IR')} تومان`;
});
</script>
