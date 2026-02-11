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
            <p class="text-2xl font-bold" :class="getPercentageClass(score.percentageWithNegative)">{{ score.percentageWithNegative }}%</p>
            <p class="text-sm text-gray-600">درصد (با نمره منفی)</p>
          </div>
        </div>
      </div>

      <!-- Questions Section -->
      <div class="space-y-6">
        <div v-for="item in sortedItems" :key="item.itemType + '-' + item.id">
          <QuestionCard
            v-if="item.itemType === 'question'"
            :question="item"
            :selectedAnswer="userAnswers[item.id]"
            :correct-answer="correctAnswers[item.id]"
            :is-readonly="true"
            view-mode="report-card"
          />
          <ExplanationCard
            v-else-if="item.itemType === 'explanation'"
            :explanation="item"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { fetchReportCardDetails } from '@/api/exams';
import QuestionCard from '@/components/exam/QuestionCard.vue';
import ExplanationCard from '@/components/exam/ExplanationCard.vue';

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
const explanations = ref([]); // New ref for explanations
const userAnswers = ref({});
const correctAnswers = ref({});
const score = ref({});

const getPercentageClass = (percentage) => {
  if (percentage >= 70) return 'text-green-600';
  if (percentage >= 40) return 'text-yellow-600';
  if (percentage >= 0) return 'text-orange-600';
  return 'text-red-600'; // For negative percentages
};

const sortedItems = computed(() => {
  const mappedQuestions = questions.value.map(q => ({ ...q, itemType: 'question', sortKey: q.position }));
  const mappedExplanations = (explanations.value || []).map(e => ({ ...e, itemType: 'explanation', sortKey: e.displayOrder - 0.5 }));
  
  const combined = [...mappedQuestions, ...mappedExplanations];
  
  return combined.sort((a, b) => {
    if (a.sortKey < b.sortKey) return -1;
    if (a.sortKey > b.sortKey) return 1;
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  });
});

onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await fetchReportCardDetails(props.examId);
    examName.value = data.reportCard.name; // Assuming name is on reportCard or exam object
    questions.value = data.questions;
    explanations.value = data.explanations || []; // Populate explanations
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
