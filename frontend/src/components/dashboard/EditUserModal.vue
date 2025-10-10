<template>
  <vue-final-modal
    classes="flex justify-center items-center"
    content-class="relative flex flex-col max-h-full mx-4 p-4 border dark:border-gray-800 rounded bg-white dark:bg-gray-900"
  >
    <span class="mr-auto mb-2">
      <button class="text-red-500" @click="close">X</button>
    </span>
    <div class="flex-grow overflow-y-auto">
        <h1 class="text-xl">ویرایش کاربر</h1>
        <form @submit.prevent="confirm" class="mt-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">نام</label>
                    <input v-model="editableUser.firstName" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">نام خانوادگی</label>
                    <input v-model="editableUser.lastName" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">ایمیل</label>
                    <input v-model="editableUser.email" type="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">شماره تلفن</label>
                    <input v-model="editableUser.phoneNumber" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">کد ملی</label>
                    <input v-model="editableUser.nationalId" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm">
                </div>
            </div>
            <div class="mt-4 flex justify-end">
                <button type="submit" class="bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors">ذخیره</button>
                <button type="button" @click="close" class="ml-2 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">انصراف</button>
            </div>
        </form>
    </div>
  </vue-final-modal>
</template>

<script setup>
import { ref, watch } from 'vue';
import { VueFinalModal } from 'vue-final-modal';

const props = defineProps({
  user: Object,
});

const emit = defineEmits(['confirm', 'close']);

const editableUser = ref({});

watch(() => props.user, (newUser) => {
  editableUser.value = { ...newUser };
});

const confirm = () => {
  emit('confirm', editableUser.value);
};

const close = () => {
  emit('close');
};
</script>
