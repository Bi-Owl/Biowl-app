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
        <draggable
          v-model="questions"
          tag="tbody"
          item-key="id"
          class="text-gray-600 text-sm font-light"
          handle=".drag-handle"
          @end="handleReorder"
        >
          <template #item="{element}">
            <tr :key="element.id" class="border-b border-gray-200 hover:bg-gray-100">
              <td class="py-3 px-6 font-semibold drag-handle cursor-move">{{ element.position }}</td>
              <td class="py-3 px-6">
                  <img :src="`${apiBaseUrl}${element.imageUrl}`" alt="Question Image" class="w-24 h-auto rounded-md object-cover cursor-pointer" @click="showImage(element.imageUrl)" />
              </td>
              <td class="py-3 px-6">{{ element.numberOfOptions }}</td>
              <td class="py-3 px-6">{{ element.correctOption }}</td>
              <td class="py-3 px-6 text-center">
                <div>
                  <button @click="openEditModal(element)" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    ویرایش
                  </button>
                  <button @click="confirmDelete(element.id)" class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center mt-2 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    حذف
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </draggable>
        <tbody v-if="!questions.length && !loading">
           <tr>
            <td colspan="5" class="py-4 px-6 text-center text-gray-500">
              هنوز سوالی برای این آزمون تعریف نشده است.
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
import draggable from 'vuedraggable';
import { getQuestionsForExam, deleteQuestion, createQuestion, updateQuestion, reorderQuestions } from '@/api/admin';
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
        const data = await getQuestionsForExam(props.examId);
        questions.value = data;
    } catch (error) {
        toast.error('خطا در دریافت سوالات.');
    } finally {
        loading.value = false;
    }
};

onMounted(fetchQuestions);

const handleReorder = async () => {
  // v-model already updated the questions ref
  // Now, update the position property on each question
  const updates = questions.value.map((question, index) => {
    question.position = index + 1;
    return {
      id: question.id,
      position: question.position,
    };
  });

  try {
    await reorderQuestions(updates);
    toast.success('ترتیب سوالات با موفقیت به‌روزرسانی شد.');
  } catch (error) {
    toast.error('خطا در به‌روزرسانی ترتیب سوالات. بازنشانی ترتیب...');
    // Re-fetch to revert to the old order on failure
    fetchQuestions();
  }
};

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

<style scoped>
.drag-handle {
  cursor: move;
}
</style>