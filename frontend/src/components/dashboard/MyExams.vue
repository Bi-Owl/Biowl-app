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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { fetchPurchasedExams } from '@/api/exams';
import ExamCard from '@/components/dashboard/ExamCard.vue';

const toast = useToast();
const exams = ref([]);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  try {
    exams.value = await fetchPurchasedExams();
  } catch (error) {
    toast.error('خطا در دریافت آزمون‌های خریداری شده.');
  } finally {
    loading.value = false;
  }
});

const handleStartExam = (exam) => {
  toast.info(`شروع آزمون "${exam.name}" به زودی پیاده‌سازی خواهد شد.`);
  // Logic to start the exam will be implemented here
};
</script>
