<template>
  <vue-final-modal
    classes="pt-16"
    content-class="relative flex flex-col max-h-full mx-auto p-4 bg-transparent border-none w-full max-w-xl"
    content-transition="slide-down"
  >
    <div class="relative bg-white rounded-xl shadow-lg border border-emerald-100 w-full flex flex-col">
      <!-- Modal header -->
      <div class="flex justify-between items-center p-5 border-b rounded-t">
        <h3 class="text-xl font-semibold text-emerald-800">
          شروع آزمون: {{ exam.name }}
        </h3>
        <button @click="close" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        </button>
      </div>
      <!-- Modal body -->
      <div class="p-6 space-y-4 text-gray-600">
        <p>شما در آستانه شروع این آزمون هستید. لطفا به نکات زیر توجه کنید:</p>
        <ul class="list-disc list-inside space-y-2 text-emerald-700 bg-emerald-50 p-4 rounded-lg">
          <li>مدت زمان پاسخ‌گویی به این آزمون <strong>{{ exam.duration }} دقیقه</strong> می‌باشد.</li>
          <li>پس از شروع آزمون، زمان شما محاسبه خواهد شد حتی اگر از صفحه خارج شوید.</li>
          <li>این آزمون شامل <strong>{{ questionCount }} سوال</strong> است.</li>
          <li>از اتصال اینترنت خود اطمینان حاصل کنید.</li>
        </ul>
        <p class="font-semibold text-gray-800">آیا برای شروع آزمون اطمینان دارید؟</p>
      </div>
      <!-- Modal footer -->
      <div class="flex items-center justify-end p-6 space-x-2 space-x-reverse border-t border-gray-200 rounded-b">
        <button @click="confirm" :disabled="loading" class="btn-hover text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-8 py-2.5 text-center disabled:opacity-50">
          <span v-if="loading">در حال شروع...</span>
          <span v-else>بله، شروع می‌کنم</span>
        </button>
        <button @click="close" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">
          انصراف
        </button>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal';

defineProps({
  exam: {
    type: Object,
    required: true,
  },
  questionCount: {
    type: Number,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['confirm', 'close']);

const confirm = () => {
  emit('confirm');
};

const close = () => {
  emit('close');
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
