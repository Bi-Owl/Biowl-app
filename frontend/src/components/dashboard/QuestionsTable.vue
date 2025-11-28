<template>
  <div>
    <div class="flex justify-end items-center mb-6">
      <button @click="openAddModal" class="btn-hover text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        افزودن سوال جدید
      </button>
    </div>
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full bg-white text-right">
        <thead class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th class="py-3 px-6">ترتیب</th>
            <th class="py-3 px-6">تصویر سوال</th>
            <th class="py-3 px-6">تعداد گزینه‌ها</th>
            <th class="py-3 px-6">گزینه صحیح</th>
            <th class="py-3 px-6 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr v-if="loading">
            <td colspan="5" class="py-4 px-6 text-center">در حال بارگذاری سوالات...</td>
          </tr>
          <tr v-else-if="questions.length === 0">
            <td colspan="5" class="py-4 px-6 text-center text-gray-500">
              هنوز سوالی برای این آزمون تعریف نشده است.
            </td>
          </tr>
          <tr v-for="q in questions" :key="q.id" class="border-b border-gray-200 hover:bg-gray-100">
            <td class="py-3 px-6 font-semibold">{{ q.position }}</td>
            <td class="py-3 px-6">
                <img :src="`${apiBaseUrl}${q.imageUrl}`" alt="Question Image" class="w-24 h-auto rounded-md object-cover cursor-pointer" @click="showImage(q.imageUrl)" />
            </td>
            <td class="py-3 px-6">{{ q.numberOfOptions }}</td>
            <td class="py-3 px-6">{{ q.correctOption }}</td>
            <td class="py-3 px-6 text-center">
              <button @click="openEditModal(q)" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                ویرایش
              </button>
              <button @click="confirmDelete(q.id)" class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors mt-2">
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
import { useToast } from 'vue-toastification';
import { useModal } from 'vue-final-modal';
import { getQuestionsForExam, deleteQuestion, createQuestion, updateQuestion } from '@/api/admin';
import AddEditQuestionModal from './AddEditQuestionModal.vue';

const props = defineProps({
  examId: {
    type: Number,
    required: true,
  },
});

const questions = ref([]);
const loading = ref(true);
const toast = useToast();
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const fetchQuestions = async () => {
    loading.value = true;
    try {
        questions.value = await getQuestionsForExam(props.examId);
    } catch (error) {
        toast.error('خطا در دریافت سوالات.');
    } finally {
        loading.value = false;
    }
};

onMounted(fetchQuestions);

const openAddModal = () => {
  const { open, close } = useModal({
    component: AddEditQuestionModal,
    attrs: {
      nextPosition: questions.value.length + 1,
      onConfirm(formData) {
        createQuestion(props.examId, formData).then(() => {
          toast.success('سوال با موفقیت ایجاد شد.');
          fetchQuestions();
          close();
        }).catch(err => toast.error(err.message));
      },
      onCancel() {
        close();
      }
    },
  });
  open();
};

const openEditModal = (question) => {
  const { open, close } = useModal({
    component: AddEditQuestionModal,
    attrs: {
      question: question,
      onConfirm(formData) {
        updateQuestion(question.id, formData).then(() => {
          toast.success('سوال با موفقیت ویرایش شد.');
          fetchQuestions();
          close();
        }).catch(err => toast.error(err.message));
      },
      onCancel() {
        close();
      }
    },
  });
  open();
};

const confirmDelete = async (id) => {
  if (confirm('آیا از حذف این سوال اطمینان دارید؟')) {
    try {
        await deleteQuestion(id);
        toast.success('سوال با موفقیت حذف شد.');
        fetchQuestions();
    } catch (error) {
        toast.error('حذف سوال با خطا مواجه شد.');
    }
  }
};

const showImage = (url) => {
    window.open(`${apiBaseUrl}${url}`, '_blank');
}
</script>