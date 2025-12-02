<template>
  <div>
    <div class="flex justify-end items-center mb-6 gap-4">
      <button @click="openAddExplanationModal" class="btn-hover text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
        افزودن توضیحات
      </button>
      <button @click="openAddModal" class="btn-hover text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        افزودن سوال
      </button>
    </div>
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full bg-white text-right">
        <thead class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th class="py-3 px-6">نوع</th>
            <th class="py-3 px-6">ترتیب</th>
            <th class="py-3 px-6">تصویر</th>
            <th class="py-3 px-6">جزئیات</th>
            <th class="py-3 px-6 text-center">عملیات</th>
          </tr>
        </thead>

        <!-- Draggable tbody for questions-only mode -->
        <draggable
          v-if="explanations.length === 0"
          v-model="questions"
          tag="tbody"
          item-key="id"
          class="text-gray-600 text-sm font-light"
          handle=".drag-handle"
          @end="handleReorder"
        >
          <template #item="{element: item}">
            <tr :key="item.id" class="border-b border-gray-200 hover:bg-gray-100">
              <td class="py-3 px-6">
                <span class="bg-emerald-100 text-emerald-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">سوال</span>
              </td>
              <td class="py-3 px-6 font-semibold drag-handle cursor-move">{{ item.position }}</td>
              <td class="py-3 px-6">
                  <img :src="`${STATIC_BASE_URL}${item.imageUrl}`" alt="Question Image" class="w-24 h-auto rounded-md object-cover cursor-pointer" @click="showImage(item.imageUrl)" />
              </td>
              <td class="py-3 px-6">
                <div>تعداد گزینه‌ها: <span class="font-semibold">{{ item.numberOfOptions }}</span></div>
                <div>گزینه صحیح: <span class="font-semibold">{{ item.correctOption }}</span></div>
              </td>
              <td class="py-3 px-6 text-center">
                <div>
                  <button @click="openEditModal(item)" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    ویرایش
                  </button>
                  <button @click="confirmDelete(item)" class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center mt-2 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    حذف
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </draggable>

        <!-- Standard tbody for mixed questions and explanations -->
        <tbody v-else class="text-gray-600 text-sm font-light">
          <tr v-for="item in sortedItems" :key="item.type + item.id" class="border-b border-gray-200 hover:bg-gray-50" :class="{'!bg-blue-50 hover:!bg-blue-100': item.type === 'explanation'}">
            <td class="py-3 px-6">
              <span :class="[item.type === 'question' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800']" class="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                {{ item.type === 'question' ? 'سوال' : 'توضیح' }}
              </span>
            </td>
            <td class="py-3 px-6 font-semibold">
                {{ item.type === 'question' ? item.position : item.displayOrder }}
            </td>
            <td class="py-3 px-6">
                <img :src="`${STATIC_BASE_URL}${item.imageUrl}`" alt="Item Image" class="w-24 h-auto rounded-md object-cover cursor-pointer" @click="showImage(item.imageUrl)" />
            </td>
            <td class="py-3 px-6">
              <div v-if="item.type === 'question'">
                <div>تعداد گزینه‌ها: <span class="font-semibold">{{ item.numberOfOptions }}</span></div>
                <div>گزینه صحیح: <span class="font-semibold">{{ item.correctOption }}</span></div>
              </div>
              <div v-else class="text-gray-500">-</div>
            </td>
            <td class="py-3 px-6 text-center">
              <div v-if="item.type === 'question'">
                <button @click="openEditModal(item)" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  ویرایش
                </button>
                <button @click="confirmDelete(item)" class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center mt-2 mx-auto">
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  حذف
                </button>
              </div>
              <div v-else>
                 <button @click="openEditExplanationModal(item)" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    ویرایش
                  </button>
                  <button @click="confirmDelete(item)" class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center mt-2 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    حذف
                  </button>
              </div>
            </td>
          </tr>
        </tbody>
        
        <!-- Tbody for empty state -->
        <tbody v-if="sortedItems.length === 0 && !loading">
           <tr>
            <td colspan="5" class="py-4 px-6 text-center text-gray-500">
              هنوز سوال یا توضیحی برای این آزمون تعریف نشده است.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useModal } from 'vue-final-modal';
import draggable from 'vuedraggable';
import { 
  getQuestionsForExam, 
  deleteQuestion, 
  createQuestion, 
  updateQuestion, 
  reorderQuestions,
  getExplanationsForExam,
  createExplanation,
  updateExplanation,
  deleteExplanation
} from '@/api/admin';
import { STATIC_BASE_URL } from '@/config/api';
import AddEditQuestionModal from '@/components/dashboard/AddEditQuestionModal.vue';
import AddEditExplanationModal from '@/components/dashboard/AddEditExplanationModal.vue';
import ConfirmModal from '@/components/ui/ConfirmModal.vue';

const props = defineProps({
  examId: {
    type: Number,
    required: true,
  },
});

const questions = ref([]);
const explanations = ref([]);
const loading = ref(true);
const toast = useToast();

const sortedItems = computed(() => {
  const mappedQuestions = questions.value.map(q => ({ ...q, type: 'question', sortKey: q.position }));
  const mappedExplanations = explanations.value.map(e => ({ ...e, type: 'explanation', sortKey: e.displayOrder - 0.5 }));
  
  const combined = [...mappedQuestions, ...mappedExplanations];
  
  return combined.sort((a, b) => {
    if (a.sortKey < b.sortKey) return -1;
    if (a.sortKey > b.sortKey) return 1;
    // If sortKeys are equal, use ID for stable sort
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  });
});

const fetchData = async () => {
    loading.value = true;
    try {
        const [questionsData, explanationsData] = await Promise.all([
            getQuestionsForExam(props.examId),
            getExplanationsForExam(props.examId)
        ]);
        questions.value = questionsData;
        explanations.value = explanationsData;
    } catch (error) {
        toast.error(error.message);
    } finally {
        loading.value = false;
    }
};

onMounted(fetchData);

const handleReorder = async () => {
  if (explanations.value.length > 0) {
    toast.info('امکان مرتب‌سازی خودکار در حالت وجود توضیحات غیرفعال است.');
    fetchData(); // Revert to original order
    return;
  }
  const updates = questions.value.map((question, index) => {
    question.position = index + 1;
    return { id: question.id, position: question.position };
  });

  try {
    const res = await reorderQuestions(updates);
    toast.success(res.message);
    await fetchData(); // Refetch to ensure consistency
  } catch (error) {
    toast.error(error.message);
    fetchData();
  }
};

// --- Question Modals ---
const openAddModal = () => {
  const { open, close } = useModal({
    component: AddEditQuestionModal,
    attrs: {
      nextPosition: questions.value.length + 1,
      onConfirm(formData) {
        createQuestion(props.examId, formData).then((res) => {
          toast.success(res.message);
          fetchData();
          close();
        }).catch(err => toast.error(err.message));
      },
      onCancel: close,
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
        updateQuestion(question.id, formData).then((res) => {
          toast.success(res.message);
          fetchData();
          close();
        }).catch(err => toast.error(err.message));
      },
      onCancel: close,
    },
  });
  open();
};

// --- Explanation Modals ---
const openAddExplanationModal = () => {
  const { open, close } = useModal({
    component: AddEditExplanationModal,
    attrs: {
      nextDisplayOrder: questions.value.length + 1,
      onConfirm(formData) {
        createExplanation(props.examId, formData).then((res) => {
          toast.success(res.message);
          fetchData();
          close();
        }).catch(err => toast.error(err.message));
      },
      onCancel: close,
    },
  });
  open();
};

const openEditExplanationModal = (explanation) => {
  const { open, close } = useModal({
    component: AddEditExplanationModal,
    attrs: {
      explanation: explanation,
      onConfirm(formData) {
        updateExplanation(explanation.id, formData).then((res) => {
          toast.success(res.message);
          fetchData();
          close();
        }).catch(err => toast.error(err.message));
      },
      onCancel: close,
    },
  });
  open();
};

// --- Generic Actions ---
const confirmDelete = (item) => {
  const isQuestion = item.type === 'question';
  const { open, close } = useModal({
    component: ConfirmModal,
    attrs: {
      title: `تایید حذف ${isQuestion ? 'سوال' : 'توضیحات'}`,
      message: `آیا از حذف این ${isQuestion ? 'سوال' : 'مورد'} اطمینان دارید؟`,
      confirmText: 'بله، حذف کن',
      confirmClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-300',
      titleClass: 'text-red-800',
      onConfirm: async () => {
        try {
          const deleteAction = isQuestion ? deleteQuestion(item.id) : deleteExplanation(item.id);
          const res = await deleteAction;
          toast.success(res.message);
          fetchData();
        } catch (error) {
          toast.error(error.message);
        } finally {
          close();
        }
      },
      onClose: close,
    }
  });
  open();
};

const showImage = (url) => {
    window.open(`${STATIC_BASE_URL}${url}`, '_blank');
}
</script>

<style scoped>
.drag-handle {
  cursor: move;
}
</style>