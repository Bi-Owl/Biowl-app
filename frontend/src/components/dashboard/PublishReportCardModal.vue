<template>
  <vue-final-modal
    classes="pt-16"
    content-class="relative flex flex-col max-h-full mx-auto p-4 bg-transparent border-none w-full max-w-2xl"
    content-transition="slide-down"
  >
    <div class="relative bg-white rounded-xl shadow-lg border border-emerald-100 w-full flex flex-col">
      <div class="flex justify-between items-center p-5 border-b rounded-t">
        <h3 class="text-xl font-semibold text-emerald-800">
          انتشار کارنامه برای: {{ examName }}
        </h3>
        <button @click="close" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        </button>
      </div>
      <form @submit.prevent="confirm" class="p-6 space-y-6">
        <fieldset :disabled="loading">
          <div>
            <label for="description" class="block mb-2 text-sm font-medium text-emerald-700">توضیحات کارنامه</label>
            <textarea v-model="reportCardData.description" id="description" rows="4" class="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg focus:ring-2 focus:ring-emerald-300 block w-full p-2.5" placeholder="توضیحات مربوط به این کارنامه..."></textarea>
          </div>
          <div>
            <label for="answerKeyPdf" class="block mb-2 text-sm font-medium text-emerald-700">فایل پاسخنامه تشریحی (اختیاری)</label>
            <input @change="handleFileUpload" type="file" id="answerKeyPdf" accept=".pdf" class="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none">
            <p class="mt-1 text-xs text-gray-500">فقط فایل PDF مجاز است.</p>
          </div>
          <div class="flex items-center">
            <label class="block text-sm font-medium text-emerald-700">نمایش رتبه به کاربران</label>
            <BaseToggle v-model="reportCardData.showRank" class="mr-4" />
          </div>
          <div class="flex items-center justify-end pt-6 space-x-2 border-t border-gray-200 rounded-b mt-6">
            <button type="submit" class="btn-hover text-white bg-emerald-600 hover:bg-emerald-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              <span v-if="loading">در حال انتشار...</span>
              <span v-else>انتشار کارنامه</span>
            </button>
            <button @click="close" type="button" class="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">
              انصراف
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  </vue-final-modal>
</template>

<script setup>
import { ref } from 'vue';
import { VueFinalModal } from 'vue-final-modal';
import BaseToggle from '@/components/ui/BaseToggle.vue';

const props = defineProps({
  examName: String,
});
const emit = defineEmits(['confirm', 'close']);

const loading = ref(false);
const reportCardData = ref({
  description: '',
  showRank: false,
  answerKeyPdf: null,
});

const handleFileUpload = (event) => {
  reportCardData.value.answerKeyPdf = event.target.files[0];
};

const confirm = () => {
  // We need to use FormData because we might have a file
  const formData = new FormData();
  formData.append('description', reportCardData.value.description);
  formData.append('showRank', reportCardData.value.showRank);
  if (reportCardData.value.answerKeyPdf) {
    formData.append('answerKeyPdf', reportCardData.value.answerKeyPdf);
  }
  
  emit('confirm', formData);
  loading.value = true; // Visual feedback
};

const close = () => {
  emit('close');
};
</script>
