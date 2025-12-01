<template>
  <div>
    <ReportCardViewer
      v-if="selectedReportCard"
      :exam-id="selectedReportCard.id"
      @back="selectedReportCard = null"
    />
    <div v-else>
      <h2 class="text-2xl font-bold mb-6 text-gray-800">کارنامه های من</h2>
      <div v-if="loading" class="text-center py-10">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-emerald-500 mx-auto"></div>
        <p class="mt-4">در حال بارگذاری کارنامه‌ها...</p>
      </div>
      <div v-else-if="reportCards.length === 0" class="text-center py-10">
        <p class="text-gray-500">در حال حاضر هیچ کارنامه‌ای برای شما منتشر نشده است.</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ReportCardCard 
          v-for="rc in reportCards" 
          :key="rc.id" 
          :report-card="rc"
          @view="handleViewReportCard"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { fetchAvailableReportCards } from '@/api/exams';
import ReportCardCard from '@/components/dashboard/ReportCardCard.vue';
import ReportCardViewer from '@/components/dashboard/ReportCardViewer.vue';

const toast = useToast();
const reportCards = ref([]);
const loading = ref(true);
const selectedReportCard = ref(null);

onMounted(async () => {
  loading.value = true;
  try {
    reportCards.value = await fetchAvailableReportCards();
  } catch (error) {
    toast.error(error.message || 'خطا در دریافت کارنامه‌ها.');
  } finally {
    loading.value = false;
  }
});

const handleViewReportCard = (reportCard) => {
  selectedReportCard.value = reportCard;
};
</script>