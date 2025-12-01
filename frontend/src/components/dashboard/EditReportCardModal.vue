<template>
  <vue-final-modal
    classes="pt-16"
    content-class="relative flex flex-col max-h-full mx-auto p-4 bg-transparent border-none w-full max-w-2xl"
    content-transition="slide-down"
  >
    <div class="relative bg-white rounded-xl shadow-lg border border-blue-100 w-full flex flex-col">
      <div class="flex justify-between items-center p-5 border-b rounded-t">
        <h3 class="text-xl font-semibold text-blue-800">
          ویرایش کارنامه برای: {{ examName }}
        </h3>
        <button @click="close" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 mr-0 inline-flex items-center">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        </button>
      </div>
      <form @submit.prevent="confirm" class="p-6">
        <fieldset :disabled="loading" class="space-y-6">
          <div>
            <label for="description" class="block mb-2 text-sm font-medium text-blue-700">توضیحات کارنامه</label>
            <textarea v-model="reportCardData.description" id="description" rows="4" class="bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-lg focus:ring-2 focus:ring-blue-300 block w-full p-2.5" placeholder="توضیحات مربوط به این کارنامه..."></textarea>
          </div>
          <div>
            <label for="answerKeyPdf" class="block mb-2 text-sm font-medium text-blue-700">فایل پاسخنامه تشریحی (اختیاری)</label>
            <label for="answerKeyPdf" class="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg class="w-10 h-10 mb-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-4-4V6a4 4 0 014-4h6a4 4 0 014 4v6a4 4 0 01-4 4H7z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2"></path></svg>
                    <p v-if="!reportCardData.answerKeyPdf" class="mb-2 text-sm text-blue-600"><span class="font-semibold">برای آپلود کلیک کنید</span> یا فایل را بکشید</p>
                    <p v-else class="mb-2 text-sm text-blue-800 font-semibold">{{ reportCardData.answerKeyPdf.name }}</p>
                    <p class="text-xs text-gray-500">PDF (حداکثر 10MB)</p>
                </div>
                <input id="answerKeyPdf" type="file" class="hidden" @change="handleFileUpload" accept=".pdf" />
            </label> 
            <p v-if="currentPdfFileName && !reportCardData.answerKeyPdf" class="mt-1 text-sm text-gray-500">فایل فعلی: <a :href="`/uploads/${currentPdfFileName}`" target="_blank" class="font-semibold text-blue-700 hover:underline">{{ currentPdfFileName }}</a>. برای جایگزینی، یک فایل جدید انتخاب کنید.</p>
            <p v-else-if="!currentPdfFileName" class="mt-1 text-sm text-gray-500">یک فایل جدید برای جایگزینی انتخاب کنید. در غیر اینصورت، فایل فعلی باقی می‌ماند.</p>
          </div>
          <div>
              <label class="block text-sm font-medium text-blue-700">وضعیت نمایش کارنامه</label>
              <BaseToggle v-model="reportCardData.isHidden" :label="reportCardData.isHidden ? 'پنهان' : 'نمایان'" class="mt-2" />
          </div>
          <div class="flex items-center justify-end pt-6 space-x-4 space-x-reverse border-t border-gray-200 rounded-b mt-6">
            <button @click.prevent="republish" type="button" class="btn-hover text-white bg-amber-500 hover:bg-amber-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              <span v-if="loading">...</span>
              <span v-else>بازنشر پاسخ‌ها</span>
            </button>
            <button type="submit" class="btn-hover text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              <span v-if="loading">در حال ذخیره...</span>
              <span v-else>ذخیره تغییرات</span>
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
import { ref, watch } from 'vue';
import { VueFinalModal } from 'vue-final-modal';
import BaseToggle from '@/components/ui/BaseToggle.vue';

const props = defineProps({
  examName: String,
  initialData: {
    type: Object,
    required: true,
  }
});
const emit = defineEmits(['confirm', 'republish', 'close']);

const loading = ref(false);
const reportCardData = ref({
  description: '',
  isHidden: true,
  answerKeyPdf: null,
});
const currentPdfFileName = ref(null); // To display the existing PDF filename

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    reportCardData.value.description = newVal.description || '';
    reportCardData.value.isHidden = newVal.isHidden === true;
    
    // Set current PDF filename if it exists
    if (newVal.answerKeyPdfUrl) {
      currentPdfFileName.value = newVal.answerKeyPdfUrl.split('/').pop();
    } else {
      currentPdfFileName.value = null;
    }
    reportCardData.value.answerKeyPdf = null; // Clear file input value
  }
}, { immediate: true });

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    reportCardData.value.answerKeyPdf = file;
    currentPdfFileName.value = file.name; // Display new file name
  } else {
    reportCardData.value.answerKeyPdf = null;
    currentPdfFileName.value = props.initialData.answerKeyPdfUrl ? props.initialData.answerKeyPdfUrl.split('/').pop() : null;
  }
};

const getFormData = (forRepublish = false) => {
  const formData = new FormData();
  formData.append('description', reportCardData.value.description);
  formData.append('isHidden', reportCardData.value.isHidden);

  // For republish, we also send showRank, even if it's not editable, to match the publish endpoint signature
  if (forRepublish) {
    formData.append('showRank', props.initialData.showRank || false);
  }

  if (reportCardData.value.answerKeyPdf) {
    formData.append('answerKeyPdf', reportCardData.value.answerKeyPdf);
  }
  return formData;
}

const confirm = () => {
  emit('confirm', getFormData());
  loading.value = true;
};

const republish = () => {
  emit('republish', getFormData(true));
  loading.value = true;
}

const close = () => {
  emit('close');
};
</script>
