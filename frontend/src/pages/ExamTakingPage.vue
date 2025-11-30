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
        <div class="max-w-4xl mx-auto space-y-6"> <!-- Added space-y-6 for spacing between questions -->
          <QuestionCard
            v-for="question in questions"
            :key="question.id"
            :question="question"
            :selected-answer="userAnswers[question.id]"
            @update-answer="handleUpdateAnswer"
          />

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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import CountdownTimer from '@/components/exam/CountdownTimer.vue';
import QuestionCard from '@/components/exam/QuestionCard.vue';
import FinishConfirmModal from '@/components/exam/FinishConfirmModal.vue';
import { updateAnswer, finishExamAttempt } from '@/api/exams';

// Initialize router and toast
const router = useRouter();
const toast = useToast();

// Reactive state
const examData = ref(null); // Will hold the full data from sessionStorage
const questions = ref([]);
const userAnswers = ref({});
const remainingTime = ref(0); // This will now be correctly calculated
const examToken = ref(null);
const attemptId = ref(null);

const showFinishModal = ref(false);
const isFinishing = ref(false);

const handleFinishExam = async (options = {}) => {
  const { silent = false } = options;
  isFinishing.value = true;
  
  try {
    const data = await finishExamAttempt(attemptId.value, examToken.value);
    if (!silent) {
      toast.success(data.message || 'آزمون شما با موفقیت ثبت شد.');
    }
  } catch (error) {
    if (!silent) {
      // Avoid showing error if it's just a 'already completed' message
      if (error.message && !error.message.includes('قبلاً')) {
        toast.error(error.message || 'خطا در ثبت نهایی آزمون.');
      }
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

  // --- Robust Timer and Status Calculation ---
  const attempt = data.attempt;
  const exam = data.exam;
  
  if (!attempt || !exam || !attempt.startedAt || !exam.duration) {
    toast.error('اطلاعات آزمون ناقص است. بازگشت به داشبورد...');
    sessionStorage.removeItem('examAttemptData');
    router.push('/dashboard');
    return;
  }

  const endTime = new Date(attempt.startedAt).getTime() + exam.duration * 60 * 1000;
  const now = new Date().getTime();
  const calculatedRemainingTime = endTime - now;

  // --- Guard against finished or expired exams ---
  if (attempt.status === 'completed' || calculatedRemainingTime <= 0) {
    if (attempt.status !== 'completed') {
      // If time expired but status isn't 'completed', it's a cleanup case
      toast.info('زمان این آزمون به پایان رسیده است. در حال ثبت نهایی...');
      // We need token and attemptId to make the call
      examToken.value = data.examToken;
      attemptId.value = attempt.id;
      handleFinishExam({ silent: true });
    } else {
      toast.info('شما این آزمون را قبلاً به پایان رسانده‌اید.');
      sessionStorage.removeItem('examAttemptData');
      router.push('/dashboard');
    }
    return;
  }

  // --- If everything is OK, set the component state ---
  examData.value = data;
  questions.value = data.questions;
  userAnswers.value = attempt.answers || {};
  remainingTime.value = calculatedRemainingTime;
  examToken.value = data.examToken;
  attemptId.value = attempt.id;
});

const handleUpdateAnswer = async (payload) => {
  try {
    userAnswers.value[payload.questionId] = payload.answer;
    
    // Also update the data in sessionStorage for persistence across reloads
    const currentData = JSON.parse(sessionStorage.getItem('examAttemptData')) || examData.value;
    if (currentData) {
      currentData.attempt.answers = userAnswers.value;
      sessionStorage.setItem('examAttemptData', JSON.stringify(currentData));
    }

    await updateAnswer(attemptId.value, payload.questionId, payload.answer, examToken.value);
    // Success toast for this is optional and can be noisy. Let's keep it off.

  } catch (error) {
    toast.error(error.message || 'خطا در ذخیره پاسخ.');
  }
};

</script>

<style scoped>
/* Scoped styles if needed */
</style>
