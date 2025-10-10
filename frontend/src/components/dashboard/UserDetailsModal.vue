<template>
  <vue-final-modal
    classes="flex justify-center items-center"
    content-class="relative flex flex-col max-h-full mx-4 p-4 border dark:border-gray-800 rounded bg-white dark:bg-gray-900"
  >
    <span class="mr-auto mb-2">
      <button class="text-red-500" @click="close">X</button>
    </span>
    <div class="flex-grow overflow-y-auto">
        <h1 class="text-xl">جزئیات کاربر</h1>
        <div class="mt-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">نام</label>
                    <p class="mt-1 text-sm text-gray-900">{{ user.firstName }}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">نام خانوادگی</label>
                    <p class="mt-1 text-sm text-gray-900">{{ user.lastName }}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">ایمیل</label>
                    <p class="mt-1 text-sm text-gray-900">{{ user.email }}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">شماره تلفن</label>
                    <p class="mt-1 text-sm text-gray-900">{{ user.phoneNumber }}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">کد ملی</label>
                    <p class="mt-1 text-sm text-gray-900">{{ user.nationalId }}</p>
                </div>
            </div>
            <div class="mt-4 flex justify-end">
                <button type="button" @click="openEdit" class="bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors">ویرایش</button>
                <button type="button" @click="close" class="ml-2 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">بستن</button>
            </div>
        </div>
    </div>
  </vue-final-modal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal';

const props = defineProps({
  user: Object,
});

const emit = defineEmits(['open-edit', 'close']);

const openEdit = () => {
  emit('open-edit', props.user);
};

const close = () => {
  emit('close');
};
</script>
