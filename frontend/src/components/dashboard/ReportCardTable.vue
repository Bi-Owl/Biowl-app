<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800 text-right">
        مدیریت کارنامه ها
      </h1>
      <!-- Maybe a search bar later -->
    </div>
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full bg-white text-right">
        <thead class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th class="py-3 px-6">#</th>
            <th class="py-3 px-6">نام آزمون</th>
            <th class="py-3 px-6">وضعیت کارنامه</th>
            <th class="py-3 px-6 text-center">آخرین بروزرسانی</th>
            <th class="py-3 px-6 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr v-if="loading">
            <td colspan="5" class="text-center py-6">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
              <p class="mt-2">در حال بارگذاری...</p>
            </td>
          </tr>
          <tr v-else-if="exams.length === 0">
            <td colspan="5" class="text-center py-6 text-gray-500">هیچ آزمونی یافت نشد.</td>
          </tr>
          <tr v-for="exam in exams" :key="exam.id" class="border-b border-gray-200 hover:bg-gray-50">
            <td class="py-3 px-6 font-semibold">{{ exam.id }}</td>
            <td class="py-3 px-6">{{ exam.name }}</td>
            <td class="py-3 px-6">
              <span v-if="exam.ReportCard" :class="exam.ReportCard.isHidden ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'" class="py-1 px-3 rounded-full text-xs">
                {{ exam.ReportCard.isHidden ? 'منتشر شده (پنهان)' : 'منتشر شده (نمایان)' }}
              </span>
              <span v-else class="bg-gray-200 text-gray-800 py-1 px-3 rounded-full text-xs">
                منتشر نشده
              </span>
            </td>
            <td class="py-3 px-6 text-center">
              {{ exam.ReportCard ? new Date(exam.ReportCard.updatedAt).toLocaleString('fa-IR') : '-' }}
            </td>
            <td class="py-3 px-6 text-center">
              <button v-if="!exam.ReportCard" @click="openPublishModal(exam)" class="bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600">
                انتشار کارنامه
              </button>
              <button v-else @click="openEditModal(exam)" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                ویرایش
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
import { useModal } from 'vue-final-modal';
import { getExamsWithReportCardStatus, publishReportCard, updateReportCard } from '@/api/admin';
import PublishReportCardModal from './PublishReportCardModal.vue';
import EditReportCardModal from './EditReportCardModal.vue';

const exams = ref([]);
const loading = ref(true);
const toast = useToast();

const fetchExams = async () => {
  loading.value = true;
  try {
    exams.value = await getExamsWithReportCardStatus();
  } catch (error) {
    toast.error(error.message);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchExams);

const openPublishModal = (exam) => {
  const { open, close } = useModal({
    component: PublishReportCardModal,
    attrs: {
      examName: exam.name,
      onConfirm: async (formData) => {
        try {
          const res = await publishReportCard(exam.id, formData);
          toast.success(res.message);
          fetchExams(); // Refresh the table
        } catch (err) {
          toast.error(err.message);
        } finally {
          close();
        }
      },
      onClose: () => close(),
    },
  });
  open();
};

const openEditModal = (exam) => {
  const { open, close } = useModal({
    component: EditReportCardModal,
    attrs: {
      examName: exam.name,
      initialData: exam.ReportCard,
      onConfirm: async (formData) => {
        try {
          const res = await updateReportCard(exam.id, formData);
          toast.success(res.message);
          fetchExams(); // Refresh the table
        } catch (err) {
          toast.error(err.message);
        } finally {
          close();
        }
      },
      onRepublish: async (formData) => {
         try {
          const res = await publishReportCard(exam.id, formData);
          toast.success(res.message);
          fetchExams(); // Refresh the table
        } catch (err) {
          toast.error(err.message);
        } finally {
          close();
        }
      },
      onClose: () => close(),
    },
  });
  open();
};
</script>