<template>
  <vue-final-modal
    classes="pt-16"
    content-class="relative flex flex-col max-h-full mx-auto p-4 bg-transparent border-none w-full max-w-2xl"
    content-transition="slide-down"
  >
    <div class="relative bg-white rounded-xl shadow-lg border border-blue-100 w-full flex flex-col flex-grow overflow-y-auto">
      <!-- Modal header -->
      <div class="flex justify-between items-center p-5 border-b rounded-t sticky top-0 bg-white z-10">
        <h3 class="text-xl font-semibold text-blue-800">
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
              <label for="displayOrder" class="block mb-2 text-sm font-medium text-blue-700">ترتیب نمایش</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
                <input v-model.number="explanationData.displayOrder" type="number" id="displayOrder" min="1" class="bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-lg focus:ring-2 focus:ring-blue-300 block w-full pl-10 p-2.5" required placeholder="قبل از سوال شماره...">
              </div>
               <p class="mt-1 text-xs text-gray-500">این توضیحات قبل از سوال با این شماره نمایش داده می‌شود.</p>
            </div>

            <div class="md:col-span-2">
                <label for="explanationImage" class="block mb-2 text-sm font-medium text-blue-700">تصویر توضیحات</label>
                <label for="explanationImage" class="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg class="w-10 h-10 mb-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1a2 2 0 01-2.828 0L8 12"></path></svg>
                        <p v-if="!explanationImageFile" class="mb-2 text-sm text-blue-600"><span class="font-semibold">برای آپلود کلیک کنید</span> یا فایل را بکشید</p>
                        <p v-else class="mb-2 text-sm text-blue-800 font-semibold">{{ explanationImageFile.name }}</p>
                        <p class="text-xs text-gray-500">PNG, JPG, GIF (حداکثر 5MB)</p>
                    </div>
                    <input id="explanationImage" type="file" class="hidden" @change="handleFileChange" accept="image/*" />
                </label> 
                <p v-if="isEditing && explanationData.imageUrl && !explanationImageFile" class="mt-1 text-sm text-gray-500">یک تصویر جدید برای جایگزینی انتخاب کنید. در غیر اینصورت، تصویر فعلی باقی می‌ماند.</p>
            </div>

          </div>
          <div class="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
            <button type="submit" class="btn-hover text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              {{ isEditing ? 'ذخیره تغییرات' : 'ایجاد توضیحات' }}
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
  explanation: {
    type: Object,
    default: null,
  },
  nextDisplayOrder: {
    type: Number,
    default: 1,
  }
});

const emit = defineEmits(['confirm', 'cancel']);
const toast = useToast();

const loading = ref(false);
const explanationData = ref({});
const explanationImageFile = ref(null);

const isEditing = computed(() => !!props.explanation);
const formTitle = computed(() => isEditing.value ? `ویرایش توضیحات` : 'افزودن توضیحات جدید');

watch(() => props.explanation, (newVal) => {
  if (isEditing.value) {
    explanationData.value = { ...newVal };
  } else {
    explanationData.value = {
      displayOrder: props.nextDisplayOrder,
    };
  }
  explanationImageFile.value = null;
}, { immediate: true });

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    explanationImageFile.value = file;
  }
};

const submit = () => {
  if (!explanationData.value.displayOrder || explanationData.value.displayOrder < 1) {
    toast.error('ترتیب نمایش باید حداقل ۱ باشد.');
    return;
  }
  if (!isEditing.value && !explanationImageFile.value) {
    toast.error('لطفا یک تصویر برای توضیحات آپلود کنید.');
    return;
  }

  const formData = new FormData();
  
  Object.keys(explanationData.value).forEach(key => {
    if (key !== 'imageUrl' && explanationData.value[key] !== null) {
      formData.append(key, explanationData.value[key]);
    }
  });

  if (explanationImageFile.value) {
    formData.append('image', explanationImageFile.value);
  }
  
  emit('confirm', formData);
};
</script>

<style scoped>
.btn-hover {
  @apply transition-colors duration-200;
}
</style>
