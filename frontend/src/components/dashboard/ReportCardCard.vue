<template>
  <div class="border rounded-lg p-4 shadow-sm bg-white flex flex-col h-full">
    <div class="flex-grow">
      <h3 class="text-lg font-semibold mb-2 text-gray-800">{{ reportCard.name }}</h3>
      <p class="text-gray-600 text-sm mb-4 whitespace-pre-wrap">{{ reportCard.ReportCard.description }}</p>
    </div>
    <hr class="my-4" />
    <div class="text-sm text-gray-500">
      <div class="flex justify-between items-center">
        <span>تاریخ انتشار:</span>
        <span class="font-bold text-gray-800">
          {{ new Date(reportCard.ReportCard.createdAt).toLocaleDateString('fa-IR') }}
        </span>
      </div>
    </div>
    <div class="mt-6 flex flex-col space-y-2">
      <button 
        v-if="canView"
        @click="$emit('view', reportCard)" 
        class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
        مشاهده کارنامه
      </button>
      <a 
        v-if="reportCard.ReportCard.answerKeyPdfUrl"
        :href="`${STATIC_BASE_URL}${reportCard.ReportCard.answerKeyPdfUrl}`"
        target="_blank"
        class="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors text-center">
        دانلود پاسخنامه تشریحی
      </a>
      <div v-if="!canView" class="text-xs text-center text-red-600 p-2 bg-red-50 rounded-md">
        برای مشاهده کارنامه، باید ابتدا در آزمون شرکت کرده و آن را به اتمام برسانید.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { STATIC_BASE_URL } from '@/config/api';

const props = defineProps({
  reportCard: {
    type: Object,
    required: true,
  },
});

defineEmits(['view']);

const canView = computed(() => {
  // User can view the report card only if their attempt for this exam is 'completed'
  return props.reportCard.UserExamAttempts?.[0]?.status === 'completed';
});
</script>
