<template>
  <vue-final-modal
    classes="pt-16"
    content-class="relative flex flex-col max-h-full mx-auto p-4 bg-transparent border-none w-full max-w-2xl"
    content-transition="slide-down"
  >
    <div class="relative bg-white rounded-xl shadow-lg border border-emerald-100 w-full flex flex-col flex-grow overflow-y-auto">
      <!-- Modal header -->
      <div class="flex justify-between items-center p-5 border-b rounded-t">
        <h3 class="text-xl font-semibold text-emerald-800">
          افزودن آزمون جدید
        </h3>
        <button @click="close" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        </button>
      </div>
      <!-- Modal body -->
      <form @submit.prevent="confirm" class="p-6 space-y-6">
        <fieldset :disabled="loading">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Exam Name -->
            <div class="md:col-span-2">
              <label for="examName" class="block mb-2 text-sm font-medium text-emerald-700">نام آزمون</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <input v-model="exam.name" type="text" id="examName" class="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg focus:ring-2 focus:ring-emerald-300 block w-full pl-10 p-2.5" placeholder="مثلا: آزمون جامع زیست شناسی" required>
              </div>
            </div>
            
            <!-- Description -->
            <div class="md:col-span-2">
              <label for="description" class="block mb-2 text-sm font-medium text-emerald-700">توضیحات</label>
              <div class="relative">
                <div class="absolute top-2.5 left-0 flex items-center pl-3 pointer-events-none">
                  <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                </div>
                <textarea v-model="exam.description" id="description" rows="4" class="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg focus:ring-2 focus:ring-emerald-300 block w-full pl-10 p-2.5" placeholder="توضیحات مربوط به آزمون..."></textarea>
              </div>
            </div>

            <!-- Start & End Time -->
            <div>
              <label for="startTime" class="block mb-2 text-sm font-medium text-emerald-700">زمان شروع (اختیاری)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <input v-model="exam.startTime" type="datetime-local" id="startTime" class="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg focus:ring-2 focus:ring-emerald-300 block w-full pl-10 p-2.5">
              </div>
            </div>
            <div>
              <label for="endTime" class="block mb-2 text-sm font-medium text-emerald-700">زمان پایان (اختیاری)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <input v-model="exam.endTime" type="datetime-local" id="endTime" class="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg focus:ring-2 focus:ring-emerald-300 block w-full pl-10 p-2.5">
              </div>
            </div>

            <!-- Price -->
            <div>
              <label for="price" class="block mb-2 text-sm font-medium text-emerald-700">قیمت</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm0 0v11a2 2 0 002 2h5"></path></svg>
                </div>
                <input v-model="exam.price" type="text" id="price" class="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg focus:ring-2 focus:ring-emerald-300 block w-full pl-10 p-2.5 pr-12 text-left" placeholder="رایگان" required>
                <span class="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500 pointer-events-none">تومان</span>
              </div>
            </div>

            <!-- Duration -->
            <div>
              <label for="duration" class="block mb-2 text-sm font-medium text-emerald-700">زمان آزمون (دقیقه)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <input v-model.number="exam.duration" type="number" id="duration" class="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg focus:ring-2 focus:ring-emerald-300 block w-full pl-10 p-2.5" placeholder="مثلا: 120">
              </div>
            </div>

            <!-- Toggles -->
            <div class="md:col-span-2 flex items-center space-x-6 space-x-reverse pt-6">
              <div>
                <label class="block mb-2 text-sm font-medium text-emerald-700">وضعیت نمایش</label>
                <BaseToggle v-model="exam.isHidden" :label="exam.isHidden ? 'پنهان' : 'نمایان'" />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-emerald-700">قابلیت خرید</label>
                <BaseToggle v-model="exam.isPurchasable" :label="exam.isPurchasable ? 'فعال' : 'غیرفعال'" />
              </div>
            </div>

          </div>
          <!-- Modal footer -->
          <div class="flex items-center justify-between pt-6 space-x-2 border-t border-gray-200 rounded-b mt-6">
            <button type="submit" class="btn-hover text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              ایجاد آزمون
            </button>
            <button @click="close" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">
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

const emit = defineEmits(['confirm', 'close']);

const loading = ref(false);
const exam = ref({
  name: '',
  description: '',
  startTime: null,
  endTime: null,
  duration: null,
  isHidden: false,
  isPurchasable: true,
  price: 'free'
});

const confirm = () => {
  const dataToEmit = { ...exam.value };

  // Handle 'free' price
  if (!dataToEmit.price || dataToEmit.price.trim() === '' || dataToEmit.price.trim().toLowerCase() === 'free') {
    dataToEmit.price = 'free';
  }

  // Handle dates and append timezone
  // The input gives a string like "2023-11-28T10:00"
  if (dataToEmit.startTime) {
    dataToEmit.startTime = `${dataToEmit.startTime}:00+03:30`;
  } else {
    dataToEmit.startTime = null;
  }
  if (dataToEmit.endTime) {
    dataToEmit.endTime = `${dataToEmit.endTime}:00+03:30`;
  } else {
    dataToEmit.endTime = null;
  }
  
  emit('confirm', dataToEmit);
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
