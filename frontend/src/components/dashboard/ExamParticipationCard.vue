<template>
  <div class="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white min-h-[160px] flex flex-col justify-between">
    <div>
      <h3 class="text-xl font-bold mb-2">خلاصه مشارکت در آزمون‌ها</h3>
      <template v-if="totalExamsCount !== null && completedExamsCount !== null">
        <p class="text-3xl font-extrabold mt-2">{{ completedExamsCount }} / {{ totalExamsCount }}</p>
        <p class="text-lg opacity-90">آزمون بیول شرکت کرده‌اید</p>
      </template>
      <p v-else class="text-lg opacity-90">در حال بارگذاری اطلاعات مشارکت...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { getTotalExamsCount, getCompletedExamsCount } from '@/api/user'; // Assuming these API functions

const toast = useToast();
const totalExamsCount = ref(null);
const completedExamsCount = ref(null);

onMounted(async () => {
  try {
    const [totalExamsData, completedExamsData] = await Promise.all([
      getTotalExamsCount(),
      getCompletedExamsCount()
    ]);
    totalExamsCount.value = totalExamsData.totalExams;
    completedExamsCount.value = completedExamsData.completedExamsCount;
  } catch (error) {
    if (error.status === 404) {
      console.error('Could not find exam participation API endpoints.');
    } else {
      toast.error('خطا در دریافت اطلاعات مشارکت در آزمون‌ها.');
      console.error('Error fetching exam participation data:', error);
    }
  }
});
</script>
