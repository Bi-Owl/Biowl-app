<template>
  <vue-final-modal
    classes="pt-16"
    content-class="relative flex flex-col max-h-full mx-auto p-4 bg-transparent border-none w-full max-w-lg"
    content-transition="slide-down"
  >
    <div class="relative bg-white rounded-xl shadow-lg border border-emerald-100 w-full">
      <!-- Modal header -->
      <div class="flex justify-between items-center p-5 border-b rounded-t">
        <h3 class="text-xl font-semibold text-emerald-800">
          ویرایش اطلاعات کاربر
        </h3>
        <button @click="close" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        </button>
      </div>
      <!-- Modal body -->
      <div class="p-6 space-y-6 relative min-h-[400px]">
        <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-80 flex justify-center items-center z-10 rounded-b-xl">
          <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
        </div>
        <form @submit.prevent="confirm">
          <fieldset :disabled="loading">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="firstName" class="block mb-2 text-sm font-medium text-emerald-700">نام</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg class="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>
                  </div>
                  <input v-model="editableUser.firstName" type="text" id="firstName" class="input-focus bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg focus:ring-2 focus:ring-emerald-300 block w-full pl-10 p-2.5" placeholder="مثلا: علی">
                </div>
              </div>
              <div>
                <label for="lastName" class="block mb-2 text-sm font-medium text-emerald-700">نام خانوادگی</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg class="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>
                  </div>
                  <input v-model="editableUser.lastName" type="text" id="lastName" class="input-focus bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg focus:ring-2 focus:ring-emerald-300 block w-full pl-10 p-2.5" placeholder="مثلا: رضایی">
                </div>
              </div>
              <div class="md:col-span-2">
                <label for="email" class="block mb-2 text-sm font-medium text-emerald-700">ایمیل</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg class="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                  </div>
                  <input v-model="editableUser.email" type="email" id="email" class="input-focus bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg focus:ring-2 focus:ring-emerald-300 block w-full pl-10 p-2.5" placeholder="example@mail.com">
                </div>
              </div>
              <div>
                <label for="phoneNumber" class="block mb-2 text-sm font-medium text-emerald-700">شماره تلفن</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg class="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                  </div>
                  <input v-model="editableUser.phoneNumber" type="text" id="phoneNumber" class="input-focus bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg focus:ring-2 focus:ring-emerald-300 block w-full pl-10 p-2.5" placeholder="09123456789">
                </div>
              </div>
              <div>
                <label for="nationalId" class="block mb-2 text-sm font-medium text-emerald-700">کد ملی</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg class="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path></svg>
                  </div>
                  <input v-model="editableUser.nationalId" type="text" id="nationalId" class="input-focus bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg focus:ring-2 focus:ring-emerald-300 block w-full pl-10 p-2.5" placeholder="1234567890">
                </div>
              </div>
            </div>
                      <!-- Modal footer -->
                      <div class="flex items-center justify-between pt-6 space-x-2 border-t border-gray-200 rounded-b mt-6">              <button type="submit" class="btn-hover text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                ذخیره تغییرات
              </button>
              <button @click="close" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">
                انصراف
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { VueFinalModal } from 'vue-final-modal';
import { getUserById } from '@/api/admin';

const props = defineProps({
  userId: Number,
});

const emit = defineEmits(['confirm', 'close']);

const editableUser = ref({});
const loading = ref(true);

watchEffect(async () => {
  if (props.userId) {
    loading.value = true;
    try {
      editableUser.value = await getUserById(props.userId);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // Optionally, handle the error, e.g., by showing a message to the user
    } finally {
      loading.value = false;
    }
  }
});

const confirm = () => {
  emit('confirm', editableUser.value);
};

const close = () => {
  emit('close');
};
</script>

<!-- 
  The `scoped` attribute is removed to allow the transition classes to be applied correctly by vue-final-modal.
  This is necessary because the transition classes are applied to elements outside of this component's scope.
-->
<style>
.input-focus {
    transition: all 0.3s ease;
    outline: none !important;
}

.input-focus:focus {
    border-color: #34d399;
    box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.2);
}

.btn-hover {
    transition: all 0.3s ease, transform 0.2s ease;
}

.btn-hover:hover {
    transform: scale(1.03);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
}
</style>
