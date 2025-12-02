<template>
  <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white min-h-[160px] flex flex-col justify-between">
    <div>
      <h3 class="text-xl font-bold mb-2">آخرین کارنامه</h3>
      <template v-if="lastReportCard">
        <p class="text-lg font-semibold">{{ lastReportCard.examName }}</p>
        <p class="text-3xl font-extrabold mt-2">{{ lastReportCard.percentage }}%</p>
      </template>
      <p v-else class="text-lg opacity-90">کارنامه‌ای یافت نشد.</p>
    </div>
    <div v-if="lastReportCard" class="flex justify-end mt-4">
      <button @click="viewReportCard" class="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-100 transition-colors">
        مشاهده جزئیات
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { getLatestReportCardSummary } from '@/api/user'; // Assuming this API function
// Import router or emit event to view details if needed
// import { useRouter } from 'vue-router';

const toast = useToast();
// const router = useRouter();
const lastReportCard = ref(null);

const viewReportCard = () => {
  // router.push({ name: 'ReportCardDetail', params: { id: lastReportCard.value.reportCardId } });
  toast.info('قابلیت مشاهده جزئیات کارنامه هنوز پیاده‌سازی نشده است.');
};

onMounted(async () => {
  try {
    lastReportCard.value = await getLatestReportCardSummary();
  } catch (error) {
    if (error === 'کارنامه تکمیل شده‌ای یافت نشد.') {
      lastReportCard.value = null; // Explicitly set to null if not found
    } else {
      toast.error('خطا در دریافت آخرین کارنامه.');
      console.error('Error fetching latest report card:', error);
    }
  }
});
</script>