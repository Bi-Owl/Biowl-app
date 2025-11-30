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
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { auth } from '@/auth';
import CountdownTimer from '@/components/exam/CountdownTimer.vue';
import QuestionCard from '@/components/exam/QuestionCard.vue';
import FinishConfirmModal from '@/components/exam/FinishConfirmModal.vue';
import { updateAnswer, finishExamAttempt } from '@/api/exams';

// Reactive state
const examData = ref(null);
const questions = ref([]);
const userAnswers = ref({});
const remainingTime = ref(0);
const examToken = ref(null);
const attemptId = ref(null);

const showFinishModal = ref(false);
const isFinishing = ref(false);

// No longer needed: const user = computed(() => auth.state.user);

onMounted(() => {
  const dataFromStorage = sessionStorage.getItem('examAttemptData');
  if (!dataFromStorage) {
    toast.error('اطلاعات آزمون یافت نشد. بازگشت به داشبورد...');
    router.push('/dashboard');
    return;
  }

  const data = JSON.parse(dataFromStorage);

  // Redirect if the attempt is already completed
  if (data.attempt.status === 'completed') {
    toast.info('شما این آزمون را قبلاً به پایان رسانده‌اید.');
    router.push('/dashboard');
    return;
  }
  
  examData.value = data;
  questions.value = data.questions;
  userAnswers.value = data.attempt.answers || {};
  remainingTime.value = data.remainingTime;
  examToken.value = data.examToken;
  attemptId.value = data.attempt.id;

  if (remainingTime.value <= 0) {
    autoFinishExam();
  }
});

const handleUpdateAnswer = async (payload) => {
  try {
    // Optimistic UI update
    userAnswers.value[payload.questionId] = payload.answer;
    
    // Update sessionStorage to persist across reloads
    const updatedData = { ...examData.value };
    updatedData.attempt.answers = userAnswers.value;
    sessionStorage.setItem('examAttemptData', JSON.stringify(updatedData));

    // Call API in the background
    const data = await updateAnswer(attemptId.value, payload.questionId, payload.answer, examToken.value);
    toast.success(data.message);

  } catch (error) {
    toast.error(error.message);
    // Revert optimistic update if API call fails (optional)
  }
};

const handleFinishExam = async () => {
  isFinishing.value = true;
  try {
    const data = await finishExamAttempt(attemptId.value, examToken.value);
    toast.success(data.message);
    
    // Cleanup and redirect
    sessionStorage.removeItem('examAttemptData');
    router.push('/dashboard');

  } catch (error) {
    toast.error(error.message);
  } finally {
    isFinishing.value = false;
    showFinishModal.value = false;
  }
};

const autoFinishExam = async () => {
  toast.warning('زمان آزمون به پایان رسید! در حال ثبت نهایی پاسخنامه...');
  await handleFinishExam();
};

</script>

<style scoped>
/* Scoped styles if needed */
</style>
