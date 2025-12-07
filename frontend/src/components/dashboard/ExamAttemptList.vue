<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800 text-right">
        وضعیت شرکت‌کنندگان: <span class="text-emerald-600">{{ exam.name }}</span>
      </h1>
      <button @click="$emit('back')" class="flex items-center text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors">
          بازگشت به لیست آزمون‌ها
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left mr-2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
      </button>
    </div>

    <!-- Search Bar -->
    <div class="mb-6">
      <input type="text" v-model="searchTerm" placeholder="جستجوی کاربر (نام، ایمیل...)" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500">
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full bg-white text-right">
        <thead class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th class="py-3 px-6">کاربر</th>
            <th class="py-3 px-6 text-center">وضعیت</th>
            <th class="py-3 px-6 text-center">درصد</th>
            <th class="py-3 px-6 text-center">صحیح</th>
            <th class="py-3 px-6 text-center">غلط</th>
            <th class="py-3 px-6 text-center">نزده</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr v-if="loading">
            <td colspan="6" class="py-4 px-6 text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
              <p class="mt-2">در حال بارگذاری اطلاعات...</p>
            </td>
          </tr>
          <tr v-else-if="filteredAttempts.length === 0">
            <td colspan="6" class="py-4 px-6 text-center text-gray-500">
              موردی یافت نشد.
            </td>
          </tr>
          <tr v-for="item in filteredAttempts" :key="item.attemptId" class="border-b border-gray-200 hover:bg-gray-100">
            <td class="py-3 px-6">
              <div class="font-semibold">{{ item.user.firstName }} {{ item.user.lastName }}</div>
              <div class="text-xs text-gray-500">{{ item.user.email }}</div>
            </td>
            <td class="py-3 px-6 text-center">
              <span v-if="item.status === 'completed'" class="bg-green-200 text-green-800 py-1 px-3 rounded-full text-xs">تکمیل شده</span>
              <span v-else class="bg-yellow-200 text-yellow-800 py-1 px-3 rounded-full text-xs">در حال آزمون</span>
            </td>
            <td v-if="item.stats" class="py-3 px-6 text-center font-mono font-bold" :class="getPercentageClass(item.stats.percentage)">
              {{ item.stats.percentage }}%
            </td>
            <td v-if="item.stats" class="py-3 px-6 text-center font-mono text-green-600">{{ item.stats.correct }}</td>
            <td v-if="item.stats" class="py-3 px-6 text-center font-mono text-red-600">{{ item.stats.incorrect }}</td>
            <td v-if="item.stats" class="py-3 px-6 text-center font-mono text-gray-500">{{ item.stats.unanswered }}</td>
            <td v-if="!item.stats" colspan="4" class="py-3 px-6 text-center text-gray-400">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { getExamAttempts } from '@/api/admin';

const props = defineProps({
  exam: {
    type: Object,
    required: true,
  },
});

defineEmits(['back']);

const attempts = ref([]);
const loading = ref(true);
const toast = useToast();
const searchTerm = ref('');

const fetchAttempts = async () => {
  loading.value = true;
  try {
    attempts.value = await getExamAttempts(props.exam.id);
  } catch (error) {
    toast.error(error.message);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchAttempts);

const filteredAttempts = computed(() => {
  if (!searchTerm.value) {
    return attempts.value;
  }
  const lowerCaseSearch = searchTerm.value.toLowerCase();
  return attempts.value.filter(item => {
    const fullName = `${item.user.firstName} ${item.user.lastName}`;
    return (
      fullName.toLowerCase().includes(lowerCaseSearch) ||
      item.user.email.toLowerCase().includes(lowerCaseSearch)
    );
  });
});

const getPercentageClass = (percentage) => {
  if (percentage >= 70) return 'text-green-600';
  if (percentage >= 40) return 'text-yellow-600';
  return 'text-red-600';
};
</script>
