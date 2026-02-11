<template>
  <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white min-h-[160px] flex flex-col justify-between">
    <div>
      <h3 class="text-xl font-bold mb-2">آخرین کارنامه</h3>
      <template v-if="lastReportCard">
        <p class="text-lg font-semibold">{{ lastReportCard.examName }}</p>
        <div class="flex items-end gap-4 mt-2">
          <p class="text-3xl font-extrabold">{{ lastReportCard.percentage }}%</p>
          <p v-if="lastReportCard.rankInfo" class="text-lg font-bold opacity-90 pb-0.5">
            رتبه: {{ lastReportCard.rankInfo.rank }} <span class="text-sm font-normal opacity-70">از {{ lastReportCard.rankInfo.totalParticipants }}</span>
          </p>
        </div>
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
import { getLatestReportCardSummary } from '@/api/user';
import { navigateTo } from '@/dashboardState';

const toast = useToast();
const lastReportCard = ref(null);

const viewReportCard = () => {
  if (lastReportCard.value && lastReportCard.value.reportCardId) {
    navigateTo('report-cards', { id: lastReportCard.value.reportCardId });
  }
};

onMounted(async () => {
  try {
    lastReportCard.value = await getLatestReportCardSummary();
  } catch (error) {
    if (error.status === 404) {
      lastReportCard.value = null; // This is expected if no report card is found
    } else {
      toast.error('خطا در دریافت آخرین کارنامه.');
      console.error('Error fetching latest report card:', error);
    }
  }
});
</script>