<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-gray-800">آزمون‌های من</h2>
    <div v-if="loading" class="text-center">
      <p>در حال بارگذاری آزمون‌ها...</p>
    </div>
    <div v-else-if="exams.length === 0" class="text-center">
      <p>شما هنوز هیچ آزمونی را خریداری نکرده‌اید.</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ExamCard v-for="exam in exams" :key="exam.id" :exam="exam">
        <template #action-button>
          <button class="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors">
            شروع آزمون
          </button>
        </template>
      </ExamCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchPurchasedExams } from '@/api/exams';
import ExamCard from './ExamCard.vue';

const exams = ref([]);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  exams.value = await fetchPurchasedExams();
  loading.value = false;
});
</script>
