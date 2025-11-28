<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800 text-right">
        مدیریت سوالات آزمون: <span class="text-emerald-600">{{ exam.name }}</span>
      </h1>
      <button @click="$emit('back')" class="flex items-center text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors">
          بازگشت به لیست آزمون‌ها
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left ml-2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
      </button>
    </div>
    <!-- The QuestionsTable will go here -->
    <div class="mt-4">
      <QuestionsTable :exam-id="exam.id" />
    </div>
  </div>
</template>

<script setup>
import QuestionsTable from '@/components/dashboard/QuestionsTable.vue';

defineProps({
  exam: {
    type: Object,
    required: true,
  },
});

defineEmits(['back']);
</script>
