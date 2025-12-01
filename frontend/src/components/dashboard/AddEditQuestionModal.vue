<template>
  <vue-final-modal
    classes="pt-16"
    content-class="relative flex flex-col max-h-full mx-auto p-4 bg-transparent border-none w-full max-w-2xl"
    content-transition="slide-down"
  >
    <div class="relative bg-white rounded-xl shadow-lg border border-emerald-100 w-full flex flex-col flex-grow overflow-y-auto">
      <!-- Modal header -->
      <div class="flex justify-between items-center p-5 border-b rounded-t sticky top-0 bg-white z-10">
        <h3 class="text-xl font-semibold text-emerald-800">
          {{ formTitle }}
        </h3>
        <button @click="$emit('cancel')" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        </button>
      </div>
      <!-- Modal body -->
      <form @submit.prevent="submit" class="p-6 space-y-6 flex-grow">
        <fieldset :disabled="loading" class="flex flex-col h-full">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
            
            <div>
              <label for="numberOfOptions" class="block mb-2 text-sm font-medium text-emerald-700">تعداد گزینه‌ها</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 16v-2m8-6h2m-18 0h2m14-4l1.42 1.42M5 5l1.42 1.42M19 19l-1.42-1.42M5 19l-1.42-1.42"></path></svg>
                </div>
                <input v-model.number="questionData.numberOfOptions" type="number" id="numberOfOptions" min="2" class="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg focus:ring-2 focus:ring-emerald-300 block w-full pl-10 p-2.5" required>
              </div>
            </div>

            <div class="md:col-span-2">
              <label class="block mb-2 text-sm font-medium text-emerald-700">گزینه صحیح</label>
              <div class="flex items-center flex-wrap gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div class="flex items-center flex-wrap gap-4">
                  <label v-for="i in Number(questionData.numberOfOptions || 0)" :key="i" class="flex items-center cursor-pointer p-2 rounded-lg hover:bg-emerald-100 transition-colors">
                    <input type="radio" :value="i" v-model.number="questionData.correctOption" name="correctOption" class="w-5 h-5 text-emerald-600 focus:ring-emerald-500 focus:ring-2 border-gray-300">
                    <span class="ml-2 text-sm font-medium text-gray-700">{{ i }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="md:col-span-2">
                <label for="questionImage" class="block mb-2 text-sm font-medium text-emerald-700">تصویر سوال</label>
                <label for="questionImage" class="flex flex-col items-center justify-center w-full h-32 border-2 border-emerald-300 border-dashed rounded-lg cursor-pointer bg-emerald-50 hover:bg-emerald-100 transition-colors">
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg class="w-10 h-10 mb-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-4-4V6a4 4 0 014-4h6a4 4 0 014 4v6a4 4 0 01-4 4H7z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2"></path></svg>
                        <p v-if="!questionImageFile" class="mb-2 text-sm text-emerald-600"><span class="font-semibold">برای آپلود کلیک کنید</span> یا فایل را بکشید</p>
                        <p v-else class="mb-2 text-sm text-emerald-800 font-semibold">{{ questionImageFile.name }}</p>
                        <p class="text-xs text-gray-500">PNG, JPG, GIF (حداکثر 5MB)</p>
                    </div>
                    <input id="questionImage" type="file" class="hidden" @change="handleFileChange" accept="image/*" />
                </label> 
                <p v-if="isEditing && questionData.imageUrl && !questionImageFile" class="mt-1 text-sm text-gray-500">یک تصویر جدید برای جایگزینی انتخاب کنید. در غیر اینصورت، تصویر فعلی باقی می‌ماند.</p>
            </div>

          </div>
          <div class="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
            <button type="submit" class="btn-hover text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              {{ isEditing ? 'ذخیره تغییرات' : 'ایجاد سوال' }}
            </button>
            <button @click="$emit('cancel')" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">
              انصراف
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  </vue-final-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { VueFinalModal } from 'vue-final-modal';
import { useToast } from 'vue-toastification';

const props = defineProps({
  question: {
    type: Object,
    default: null,
  },
  nextPosition: {
    type: Number,
    default: 1,
  }
});

const emit = defineEmits(['confirm', 'cancel']);
const toast = useToast();

const loading = ref(false);
const questionData = ref({});
const questionImageFile = ref(null);

const isEditing = computed(() => !!props.question);
const formTitle = computed(() => isEditing.value ? `ویرایش سوال ${props.question.position}` : 'افزودن سوال جدید');

watch(() => props.question, (newVal) => {
  if (isEditing.value) {
    questionData.value = { ...newVal };
  } else {
    questionData.value = {
      numberOfOptions: 4,
      correctOption: null,
    };
  }
  questionImageFile.value = null;
}, { immediate: true });

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    questionImageFile.value = file;
  }
};

const submit = () => {
  if (!questionData.value.numberOfOptions || questionData.value.numberOfOptions < 2) {
    toast.error('تعداد گزینه‌ها باید حداقل ۲ باشد.');
    return;
  }
  if (!questionData.value.correctOption) {
    toast.error('لطفا گزینه صحیح را انتخاب کنید.');
    return;
  }
  if (!isEditing.value && !questionImageFile.value) {
    toast.error('لطفا یک تصویر برای سوال آپلود کنید.');
    return;
  }

  const formData = new FormData();
  
  if (isEditing.value) {
    formData.append('position', questionData.value.position);
  } else {
    formData.append('position', props.nextPosition);
  }

  Object.keys(questionData.value).forEach(key => {
    if (key !== 'imageUrl' && key !== 'position' && questionData.value[key] !== null) {
      formData.append(key, questionData.value[key]);
    }
  });

  if (questionImageFile.value) {
    formData.append('image', questionImageFile.value);
  }
  
  emit('confirm', formData);
};
</script>

<style scoped>
.btn-hover {
  @apply transition-colors duration-200;
}
</style>
