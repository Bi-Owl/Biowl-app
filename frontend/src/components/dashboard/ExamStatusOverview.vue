<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800 text-right">
        وضعیت شرکت در آزمون
      </h1>
    </div>
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full bg-white text-right">
        <thead class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th class="py-3 px-6">نام آزمون</th>
            <th class="py-3 px-6 text-center">تعداد شرکت‌کنندگان</th>
            <th class="py-3 px-6 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr v-if="loading" class="border-b border-gray-200">
            <td colspan="3" class="py-4 px-6 text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
              <p class="mt-2">در حال بارگذاری اطلاعات...</p>
            </td>
          </tr>
          <tr v-else-if="exams.length === 0" class="border-b border-gray-200">
            <td colspan="3" class="py-4 px-6 text-center text-gray-500">
              هیچ آزمونی یافت نشد.
            </td>
          </tr>
          <tr v-for="(exam, index) in exams" :key="exam.id" class="border-b border-gray-200 hover:bg-gray-100" :class="{ 'bg-gray-50': index % 2 !== 0 }">
            <td class="py-3 px-6 font-semibold">{{ exam.name }}</td>
            <td class="py-3 px-6 text-center font-mono">{{ exam.attemptCount }}</td>
            <td class="py-3 px-6 text-center">
              <button @click="$emit('view-attempts', exam)" class="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors flex items-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                مشاهده وضعیت
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { getExamsStatusOverview } from '@/api/admin';

defineEmits(['view-attempts']);

const exams = ref([]);
const loading = ref(true);
const toast = useToast();

const fetchExams = async () => {
  loading.value = true;
  try {
    exams.value = await getExamsStatusOverview();
  } catch (error) {
    toast.error(error.message);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchExams);
</script>
