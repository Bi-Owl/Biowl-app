<template>
  <vue-final-modal
    classes="pt-16"
    content-class="relative flex flex-col max-h-full mx-auto p-4 bg-transparent border-none w-full max-w-lg"
    content-transition="slide-down"
  >
    <div class="relative bg-white rounded-xl shadow-lg border w-full flex flex-col">
      <!-- Modal header -->
      <div class="flex justify-between items-center p-5 border-b rounded-t">
        <h3 class="text-xl font-semibold" :class="titleClass">
          {{ title }}
        </h3>
        <button @click="close" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        </button>
      </div>
      <!-- Modal body -->
      <div class="p-6 space-y-4 text-gray-600">
        <p>{{ message }}</p>
      </div>
      <!-- Modal footer -->
      <div class="flex items-center justify-end p-6 space-x-2 space-x-reverse border-t border-gray-200 rounded-b">
        <button @click="confirm" class="btn-hover text-white font-medium rounded-lg text-sm px-8 py-2.5 text-center" :class="confirmClass">
          {{ confirmText }}
        </button>
        <button @click="close" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">
          {{ cancelText }}
        </button>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal';

defineProps({
  title: {
    type: String,
    default: 'تایید عملیات'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'تایید'
  },
  cancelText: {
    type: String,
    default: 'انصراف'
  },
  titleClass: {
    type: String,
    default: 'text-gray-800'
  },
  confirmClass: {
    type: String,
    default: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300'
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
