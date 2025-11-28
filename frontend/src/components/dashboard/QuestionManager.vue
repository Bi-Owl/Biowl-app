<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <button @click="$emit('back')" class="flex items-center text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right ml-2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          بازگشت به لیست آزمون‌ها
        </button>
        <h1 class="text-2xl font-bold text-gray-800 text-right mt-1">
          مدیریت سوالات آزمون: <span class="text-emerald-600">{{ exam.name }}</span>
        </h1>
      </div>
    </div>
    <!-- The QuestionsTable will go here -->
    <div class="mt-4">
      <QuestionsTable :exam-id="exam.id" />
    </div>
  </div>
</template>

<script setup>
import QuestionsTable from './QuestionsTable.vue';

defineProps({
  exam: {
    type: Object,
    required: true,
  },
});

defineEmits(['back']);
</script>
