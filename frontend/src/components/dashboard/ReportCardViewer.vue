<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 v-if="!loading" class="text-2xl font-bold text-gray-800">
        کارنامه آزمون: {{ examName }}
      </h2>
      <button @click="$emit('back')" class="flex items-center text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors">
        بازگشت به لیست کارنامه‌ها
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left mr-2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
      </button>
    </div>

    <div v-if="loading" class="text-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-emerald-500 mx-auto"></div>
      <p class="mt-4">در حال بارگذاری کارنامه...</p>
    </div>
    
    <div v-else-if="error" class="text-center py-10">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <div v-else class="max-w-4xl mx-auto">
      <!-- Score Summary Section -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 class="text-xl font-bold text-gray-800 mb-4">خلاصه عملکرد شما</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div class="p-4 bg-green-50 rounded-lg">
            <p class="text-2xl font-bold text-green-600">{{ score.correctCount }}</p>
            <p class="text-sm text-gray-600">صحیح</p>
          </div>
          <div class="p-4 bg-red-50 rounded-lg">
            <p class="text-2xl font-bold text-red-600">{{ score.incorrectCount }}</p>
            <p class="text-sm text-gray-600">غلط</p>
          </div>
          <div class="p-4 bg-gray-100 rounded-lg">
            <p class="text-2xl font-bold text-gray-700">{{ score.unansweredCount }}</p>
            <p class="text-sm text-gray-600">نزده</p>
          </div>
          <div class="p-4 bg-blue-50 rounded-lg">
            <p class="text-2xl font-bold text-blue-600">{{ score.percentageWithNegative }}%</p>
            <p class="text-sm text-gray-600">درصد (با نمره منفی)</p>
          </div>
        </div>
      </div>

      <!-- Questions Section -->
      <div class="space-y-6">
        <QuestionCard
          v-for="question in questions"
          :key="question.id"
          :question="question"
          :selected-answer="userAnswers[question.id]"
          :correct-answer="correctAnswers[question.id]"
          :is-readonly="true"
          view-mode="report-card"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { fetchReportCardDetails } from '@/api/exams';
import QuestionCard from '@/components/exam/QuestionCard.vue';

const props = defineProps({
  examId: {
    type: Number,
    required: true,
  },
});

defineEmits(['back']);

const toast = useToast();
const loading = ref(true);
const error = ref(null);
const examName = ref('');
const questions = ref([]);
const userAnswers = ref({});
const correctAnswers = ref({});
const score = ref({});

onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await fetchReportCardDetails(props.examId);
    examName.value = data.reportCard.name; // Assuming name is on reportCard or exam object
    questions.value = data.questions;
    userAnswers.value = data.attempt.answers || {};
    correctAnswers.value = data.reportCard.correctAnswers || {};
    score.value = data.score;
  } catch (err) {
    toast.error(err.message);
    error.value = 'خطا در بارگذاری کارنامه.';
  } finally {
    loading.value = false;
  }
});
</script>
