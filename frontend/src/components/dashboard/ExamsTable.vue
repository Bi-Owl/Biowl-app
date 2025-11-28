<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800 text-right">مدیریت آزمون ها</h1>
      <button @click="openCreateModal" class="btn-hover text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        افزودن آزمون جدید
      </button>
    </div>
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full bg-white text-right">
        <thead class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th class="py-3 px-6">#</th>
            <th class="py-3 px-6">نام آزمون</th>
            <th class="py-3 px-6">وضعیت</th>
            <th class="py-3 px-6">قیمت</th>
            <th class="py-3 px-6 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr v-if="loading" class="border-b border-gray-200">
            <td colspan="5" class="py-4 px-6 text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
              <p class="mt-2">در حال بارگذاری اطلاعات...</p>
            </td>
          </tr>
          <tr v-else-if="exams.length === 0" class="border-b border-gray-200">
            <td colspan="5" class="py-4 px-6 text-center text-gray-500">
              هیچ آزمونی یافت نشد.
            </td>
          </tr>
          <tr v-for="(exam, index) in exams" :key="exam.id" class="border-b border-gray-200 hover:bg-gray-100" :class="{ 'bg-gray-50': index % 2 !== 0 }">
            <td class="py-3 px-6 font-semibold">{{ exam.id }}</td>
            <td class="py-3 px-6">{{ exam.name }}</td>
            <td class="py-3 px-6">
              <span :class="exam.isHidden ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'" class="py-1 px-3 rounded-full text-xs">
                {{ exam.isHidden ? 'پنهان' : 'قابل مشاهده' }}
              </span>
            </td>
            <td class="py-3 px-6">
              <span class="font-mono" :class="exam.price === 'free' ? 'text-green-600' : 'text-gray-800'">
                {{ exam.price === 'free' ? 'رایگان' : `${exam.price} تومان` }}
              </span>
            </td>
            <td class="py-3 px-6 text-center">
              <button @click="openEditModal(exam)" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                ویرایش
              </button>
              <button @click="confirmDelete(exam.id)" class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center mt-2 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                حذف
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
import { getExams, createExam, updateExam, deleteExam } from '@/api/admin';
import { useToast } from 'vue-toastification';
import { useModal } from 'vue-final-modal';
import CreateExamModal from './CreateExamModal.vue';
import EditExamModal from './EditExamModal.vue';

const exams = ref([]);
const loading = ref(true);
const toast = useToast();

const fetchExams = async () => {
  loading.value = true;
  try {
    exams.value = await getExams();
  } catch (error) {
    toast.error('خطا در دریافت لیست آزمون‌ها');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchExams);

const { open: openCreateModal, close: closeCreateModal } = useModal({
  component: CreateExamModal,
  attrs: {
    onConfirm(newExam) {
      createExam(newExam)
        .then(res => {
          toast.success(res.message);
          fetchExams();
          closeCreateModal();
        })
        .catch(err => {
          toast.error(err.message);
        });
    },
    onClose() {
      closeCreateModal();
    }
  },
});

const openEditModal = (exam) => {
  const { open, close } = useModal({
    component: EditExamModal,
    attrs: {
      examId: exam.id,
      onConfirm(updatedExam) {
        updateExam(updatedExam.id, updatedExam)
          .then(res => {
            toast.success(res.message);
            fetchExams();
            close();
          })
          .catch(err => {
            toast.error(err.message);
          });
      },
      onClose() {
        close();
      }
    },
  });
  open();
};

const confirmDelete = async (id) => {
  if (confirm('آیا از حذف این آزمون اطمینان دارید؟')) {
    try {
      await deleteExam(id);
      toast.success('آزمون با موفقیت حذف شد.');
      fetchExams(); // Refresh the list
    } catch (error) {
      toast.error('خطا در حذف آزمون.');
      console.error(error);
    }
  }
};
</script>

<style scoped>
.btn-hover {
    transition: all 0.3s ease, transform 0.2s ease;
}

.btn-hover:hover {
    transform: scale(1.03);
}
</style>
