<template>
  <div>
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
        @start="handleStartExam"
      />
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { fetchPurchasedExams, startExamAttempt } from '@/api/exams';
import ExamCard from '@/components/dashboard/ExamCard.vue';
import StartConfirmModal from '@/components/exam/StartConfirmModal.vue';

const toast = useToast();
const router = useRouter();
const exams = ref([]);
const loading = ref(true);

const showStartModal = ref(false);
const selectedExam = ref(null);
const startLoading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    // Ideally, the backend should provide the question count with the purchased exams list.
    // We are assuming it might exist, or it will be gracefully handled as 0.
    exams.value = await fetchPurchasedExams();
  } catch (error) {
    toast.error('خطا در دریافت آزمون‌های خریداری شده.');
  } finally {
    loading.value = false;
  }
});

const handleStartExam = (exam) => {
  selectedExam.value = exam;
  showStartModal.value = true;
};

const confirmStartExam = async () => {
  if (!selectedExam.value) return;
  startLoading.value = true;
  try {
    const data = await startExamAttempt(selectedExam.value.id);
    
    // Save the entire payload to sessionStorage to be picked up by the exam page
    sessionStorage.setItem('examAttemptData', JSON.stringify(data));

    toast.success(`آزمون "${selectedExam.value.name}" با موفقیت شروع شد!`);
    
    // Navigate to the exam taking page
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
