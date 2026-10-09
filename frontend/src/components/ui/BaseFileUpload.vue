<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block mb-2 text-sm font-medium text-emerald-700">
      {{ label }}
    </label>
    <label
      :for="id"
      class="flex flex-col items-center justify-center w-full h-32 border-2 border-emerald-300 border-dashed rounded-lg cursor-pointer bg-emerald-50 hover:bg-emerald-100 transition-colors duration-200 group"
    >
      <div class="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
        <svg
          class="w-10 h-10 mb-3 text-emerald-500 group-hover:scale-105 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-4-4V6a4 4 0 014-4h6a4 4 0 014 4v6a4 4 0 01-4 4H7z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2"></path>
        </svg>
        <p v-if="!modelValue" class="mb-2 text-sm text-emerald-600">
          <span class="font-semibold">برای آپلود کلیک کنید</span> یا فایل را بکشید
        </p>
        <p v-else class="mb-2 text-sm text-emerald-800 font-semibold truncate max-w-xs">
          {{ modelValue.name }}
        </p>
        <p v-if="hint" class="text-xs text-gray-500">
          {{ hint }}
        </p>
      </div>
      <input
        :id="id"
        type="file"
        class="hidden"
        :accept="accept"
        @change="onFileChange"
      />
    </label>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [Object, File, null],
    default: null
  },
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  accept: {
    type: String,
    default: '*/*'
  },
  hint: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const onFileChange = (event) => {
  const file = event.target.files[0] || null;
  emit('update:modelValue', file);
  emit('change', event);
};
</script>
