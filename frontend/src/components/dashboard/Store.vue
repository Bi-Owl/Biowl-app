<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-gray-800">فروشگاه آزمون</h2>
    <div v-if="loading" class="text-center">
      <p>در حال بارگذاری آزمون‌ها...</p>
    </div>
    <div v-else-if="exams.length === 0" class="text-center">
      <p>آزمونی برای نمایش وجود ندارد.</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ExamCard v-for="exam in purchasableExams" :key="exam.id" :exam="exam">
        <template #action-button>
          <button 
            @click="handlePurchase(exam.id)"
            :disabled="isPurchasing[exam.id]"
            class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400">
            {{ isPurchasing[exam.id] ? 'در حال خرید...' : 'خرید' }}
          </button>
        </template>
      </ExamCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { fetchPublicExams, purchaseExam } from '@/api/exams';
import ExamCard from './ExamCard.vue';

const toast = useToast();
const exams = ref([]);
const loading = ref(true);
const isPurchasing = ref({});

const purchasableExams = computed(() => {
  return exams.value.filter(exam => exam.isPurchasable);
});

onMounted(async () => {
  loading.value = true;
  exams.value = await fetchPublicExams();
  loading.value = false;
});

const handlePurchase = async (examId) => {
  isPurchasing.value[examId] = true;
  try {
    const result = await purchaseExam(examId);
    toast.success(result.message);
    // Optionally, refresh or update the UI
  } catch (error) {
    toast.error(error.message || 'خرید آزمون با خطا مواجه شد.');
  } finally {
    isPurchasing.value[examId] = false;
  }
};
</script>
