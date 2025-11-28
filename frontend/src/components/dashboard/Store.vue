<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-gray-800">فروشگاه آزمون</h2>
    <div v-if="loading" class="text-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-emerald-500 mx-auto"></div>
      <p class="mt-4">در حال بارگذاری آزمون‌ها...</p>
    </div>
    <div v-else-if="exams.length === 0" class="text-center py-10">
      <p class="text-gray-500">در حال حاضر آزمون قابل خریدی وجود ندارد.</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ExamCard 
        v-for="exam in exams" 
        :key="exam.id" 
        :exam="exam"
        :is-purchased="purchasedExamIds.has(exam.id)"
        :is-purchasing="isPurchasing[exam.id]"
        @purchase="handlePurchase"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { fetchPublicExams, fetchPurchasedExams, purchaseExam } from '@/api/exams';
import { auth } from '@/auth';
import ExamCard from '@/components/dashboard/ExamCard.vue';

const toast = useToast();
const exams = ref([]);
const purchasedExamIds = ref(new Set());
const loading = ref(true);
const isPurchasing = ref({});

onMounted(async () => {
  loading.value = true;
  try {
    const [publicExams, purchased] = await Promise.all([
      fetchPublicExams(),
      fetchPurchasedExams()
    ]);
    
    exams.value = publicExams;
    purchasedExamIds.value = new Set(purchased.map(e => e.id));

  } catch (error) {
    toast.error('خطا در دریافت اطلاعات آزمون‌ها.');
  } finally {
    loading.value = false;
  }
});

const handlePurchase = async (exam) => {
  // Frontend wallet check
  const price = parseFloat(exam.price);
  if (exam.price !== 'free' && auth.state.user.wallet < price) {
    toast.error('موجودی کیف پول شما برای خرید این آزمون کافی نیست.');
    return;
  }

  isPurchasing.value[exam.id] = true;
  try {
    const result = await purchaseExam(exam.id);
    toast.success(result.message);
    
    // Update UI immediately
    purchasedExamIds.value.add(exam.id);
    if (result.newBalance !== undefined) {
      auth.updateWallet(result.newBalance);
    }

  } catch (error) {
    toast.error(error.message || 'خرید آزمون با خطا مواجه شد.');
  } finally {
    isPurchasing.value[exam.id] = false;
  }
};
</script>
