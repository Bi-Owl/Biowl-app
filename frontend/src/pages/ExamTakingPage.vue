<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Floating Countdown Timer -->
    <CountdownTimer 
      v-if="examData"
      :initial-time="remainingTime" 
      @finished="autoFinishExam" 
      class="fixed top-4 left-1/2 -translate-x-1/2 z-50" 
    />

    <div v-if="!examData" class="flex items-center justify-center h-screen">
      <p class="text-xl text-gray-500">در حال بارگذاری اطلاعات آزمون...</p>
    </div>
    <div v-else>
      <!-- Main Content -->
      <main class="container mx-auto px-4 py-20"> <!-- Increased py to avoid overlap with timer -->
        <div class="max-w-4xl mx-auto space-y-6">
          <div v-for="item in sortedItems" :key="item.itemType + '-' + item.id">
            <QuestionCard
              v-if="item.itemType === 'question'"
              :question="item"
              :selectedAnswer="userAnswers[item.id]"
              :pending-update="pendingUpdate"
              @update-answer="handleUpdateAnswer"
            />
            <ExplanationCard
              v-else-if="item.itemType === 'explanation'"
              :explanation="item"
            />
          </div>

          <!-- Finish Button -->
          <div class="mt-12 text-center">
            <button @click="showFinishModal = true" class="btn-hover text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-lg px-12 py-3.5 text-center">
              پایان آزمون و ثبت نهایی پاسخ‌ها
            </button>
          </div>
        </div>
      </main>

      <!-- Finish Confirmation Modal -->
      <FinishConfirmModal
        v-model="showFinishModal"
        :loading="isFinishing"
        @confirm="handleFinishExam"
        @close="showFinishModal = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import CountdownTimer from '@/components/exam/CountdownTimer.vue';
import QuestionCard from '@/components/exam/QuestionCard.vue';
import ExplanationCard from '@/components/exam/ExplanationCard.vue';
import FinishConfirmModal from '@/components/exam/FinishConfirmModal.vue';
import { updateAnswer, finishExamAttempt } from '@/api/exams';

const router = useRouter();
const toast = useToast();

const examData = ref(null);
const questions = ref([]);
const explanations = ref([]);
const userAnswers = ref({});
const remainingTime = ref(0);
const examToken = ref(null);
const attemptId = ref(null);
const pendingUpdate = ref(null); // { questionId, answer }

const showFinishModal = ref(false);
const isFinishing = ref(false);

const sortedItems = computed(() => {
  const mappedQuestions = questions.value.map(q => ({ ...q, itemType: 'question', sortKey: q.position }));
  const mappedExplanations = (explanations.value || []).map(e => ({ ...e, itemType: 'explanation', sortKey: e.displayOrder - 0.5 }));
  
  const combined = [...mappedQuestions, ...mappedExplanations];
  
  return combined.sort((a, b) => a.sortKey - b.sortKey);
});

const handleFinishExam = async (options = {}) => {
  const { silent = false } = options;
  isFinishing.value = true;
  try {
    const data = await finishExamAttempt(attemptId.value);
    if (!silent) toast.success(data.message);
  } catch (error) {
    if (!silent && error.message && !error.message.includes('قبلاً')) {
      toast.error(error.message);
    }
  } finally {
    isFinishing.value = false;
    showFinishModal.value = false;
    sessionStorage.removeItem('examAttemptData');
    router.push('/dashboard');
  }
};

const autoFinishExam = async () => {
  toast.warning('زمان آزمون به پایان رسید! در حال ثبت نهایی پاسخنامه...');
  await handleFinishExam({ silent: true });
};

onMounted(() => {
  const dataFromStorage = sessionStorage.getItem('examAttemptData');
  if (!dataFromStorage) {
    toast.error('اطلاعات آزمون یافت نشد. بازگشت به داشبورد...');
    router.push('/dashboard');
    return;
  }
  const data = JSON.parse(dataFromStorage);
  const { attempt, exam } = data;

  if (!attempt || !exam || !attempt.startedAt || !exam.duration) {
    toast.error('اطلاعات آزمون ناقص است. بازگشت به داشبورد...');
    sessionStorage.removeItem('examAttemptData');
    router.push('/dashboard');
    return;
  }

  const endTime = new Date(attempt.startedAt).getTime() + exam.duration * 60 * 1000;
  const calculatedRemainingTime = endTime - new Date().getTime();

  if (attempt.status === 'completed' || calculatedRemainingTime <= 0) {
    if (attempt.status !== 'completed') {
      toast.info('زمان این آزمون به پایان رسیده است. در حال ثبت نهایی...');
      attemptId.value = attempt.id;
      handleFinishExam({ silent: true });
    } else {
      toast.info('شما این آزمون را قبلاً به پایان رسانده‌اید.');
      sessionStorage.removeItem('examAttemptData');
      router.push('/dashboard');
    }
    return;
  }

  examData.value = data;
  questions.value = data.questions;
  explanations.value = data.explanations || [];
  userAnswers.value = attempt.answers || {};
  remainingTime.value = calculatedRemainingTime;
  examToken.value = data.examToken;
  attemptId.value = attempt.id;
});

const handleUpdateAnswer = async (payload) => {
  const { questionId, answer, index = null } = payload;
  
  if (pendingUpdate.value) return; // Don't allow multiple updates at once

  pendingUpdate.value = { questionId, answer, index };

  try {
    await updateAnswer(attemptId.value, questionId, answer, examToken.value);
    userAnswers.value[questionId] = answer;
    
    const currentData = JSON.parse(sessionStorage.getItem('examAttemptData'));
    if (currentData) {
      currentData.attempt.answers = userAnswers.value;
      sessionStorage.setItem('examAttemptData', JSON.stringify(currentData));
    }
  } catch (error) {
    toast.error(error.message);
  } finally {
    pendingUpdate.value = null;
  }
};
</script>

<style scoped>
/* Scoped styles if needed */
</style>
