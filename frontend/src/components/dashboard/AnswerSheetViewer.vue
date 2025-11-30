<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">
        پاسخنامه آزمون: {{ examName }}
      </h2>
      <button @click="$emit('back')" class="btn-hover text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2 transform rotate-180"><polyline points="9 18 15 12 9 6"></polyline></svg>
        بازگشت به لیست
      </button>
    </div>

    <div v-if="loading" class="text-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-emerald-500 mx-auto"></div>
      <p class="mt-4">در حال بارگذاری پاسخنامه...</p>
    </div>
    
    <div v-else-if="error" class="text-center py-10">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <div v-else class="max-w-4xl mx-auto space-y-6">
      <QuestionCard
        v-for="question in questions"
        :key="question.id"
        :question="question"
        :selected-answer="userAnswers[question.id]"
        :is-readonly="true"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { reviewAttempt } from '@/api/exams';
import QuestionCard from '@/components/exam/QuestionCard.vue';

const props = defineProps({
  attemptId: {
    type: Number,
    required: true,
  },
  examName: {
    type: String,
    required: true,
  }
});

defineEmits(['back']);

const toast = useToast();
const loading = ref(true);
const error = ref(null);
const questions = ref([]);
const userAnswers = ref({});

onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await reviewAttempt(props.attemptId);
    questions.value = data.questions;
    userAnswers.value = data.attempt.answers || {};
  } catch (err) {
    toast.error(err.message);
    error.value = 'خطا در بارگذاری پاسخنامه. لطفا دوباره تلاش کنید.';
  } finally {
    loading.value = false;
  }
});
</script>
