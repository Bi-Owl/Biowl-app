<template>
  <div>
    <AnswerSheetViewer 
      v-if="selectedAttemptForReview"
      :attempt-id="selectedAttemptForReview.id"
      :exam-name="selectedAttemptForReview.examName"
      @back="selectedAttemptForReview = null"
    />
    <div v-else>
      <h2 class="text-2xl font-bold mb-6 text-gray-800">آزمون‌های من</h2>
      <div v-if="loading" class="text-center py-10">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-emerald-500 mx-auto"></div>
        <p class="mt-4">در حال بارگذاری آزمون‌ها...</p>
      </div>
      <div v-else-if="exams.length === 0" class="text-center py-10">
        <p class="text-gray-500">شما هنوز هیچ آزمونی را خریداری نکرده‌اید.</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ExamCard 
          v-for="exam in exams" 
          :key="exam.id" 
          :exam="exam"
          :action-type="'start'"
          @handle-action="handleExamAction"
          @attempt-expired="handleAttemptExpired"
        />
      </div>
    </div>

    <!-- Start Exam Confirmation Modal -->
    <StartConfirmModal
      v-if="showStartModal && selectedExam"
      v-model="showStartModal"
      :exam="selectedExam"
      :question-count="selectedExam.questionCount || 0" 
      :loading="startLoading"
      @confirm="confirmStartExam"
      @close="showStartModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { fetchPurchasedExams, startExamAttempt, finishExamAttempt } from '@/api/exams';
import ExamCard from '@/components/dashboard/ExamCard.vue';
import StartConfirmModal from '@/components/exam/StartConfirmModal.vue';
import AnswerSheetViewer from '@/components/dashboard/AnswerSheetViewer.vue';

const props = defineProps({
  currentView: String,
});

const toast = useToast();
const router = useRouter();
const exams = ref([]);
const loading = ref(true);

const showStartModal = ref(false);
const selectedExam = ref(null);
const startLoading = ref(false);

const selectedAttemptForReview = ref(null);

const fetchExams = async () => {
  loading.value = true;
  try {
    exams.value = await fetchPurchasedExams();
  } catch (error) {
    toast.error(error.message || 'خطا در دریافت آزمون‌های خریداری شده.');
  } finally {
    loading.value = false;
  }
};

watch(() => props.currentView, (newView) => {
  if (newView === 'my-exams') {
    // When the view becomes active, reset selections and fetch fresh data
    selectedAttemptForReview.value = null;
    fetchExams();
  }
}, { immediate: true });

const handleExamAction = (exam) => {
  const status = exam.attempt?.status;

  if (status === 'completed') {
    // Show answer sheet
    selectedAttemptForReview.value = { id: exam.attempt.id, examName: exam.name };
  } else if (status === 'in_progress') {
    // Resume exam - just navigate to the page
    // The page logic will handle loading from sessionStorage
    router.push({ name: 'ExamAttempt', params: { examId: exam.id } });
  } else {
    // Start exam - show confirmation modal
    selectedExam.value = exam;
    showStartModal.value = true;
  }
};

const handleAttemptExpired = async (examId) => {
  const exam = exams.value.find(e => e.id === examId);
  if (exam && exam.attempt && exam.attempt.status !== 'completed') {
    try {
      // Call the API to mark as completed on the backend
      await finishExamAttempt(exam.attempt.id);
      // Update the local state to 'completed' to instantly refresh the UI
      exam.attempt.status = 'completed';
      toast.info(`زمان آزمون "${exam.name}" به پایان رسید و پاسخنامه ثبت شد.`);
    } catch (error) {
      toast.error(error.message || 'خطا در ثبت خودکار آزمون.');
    }
  }
};

const confirmStartExam = async () => {
  if (!selectedExam.value) return;
  startLoading.value = true;
  try {
    const data = await startExamAttempt(selectedExam.value.id);
    
    sessionStorage.setItem('examAttemptData', JSON.stringify(data));

    toast.success(`آزمون "${selectedExam.value.name}" با موفقیت شروع شد!`);
    
    router.push({
      name: 'ExamAttempt',
      params: { examId: selectedExam.value.id }
    });

  } catch (error) {
    toast.error(error.message);
    showStartModal.value = false;
  } finally {
    startLoading.value = false;
  }
};
</script>
