<template>
  <label :for="id" class="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      :id="id"
      class="sr-only peer"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <div
      class="relative w-14 h-8 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 peer-checked:bg-emerald-500 transition-colors"
    >
      <div
        :class="modelValue ? 'translate-x-6' : 'translate-x-1'"
        class="absolute top-1 left-1 bg-white border-gray-300 border rounded-full h-6 w-6 transition-transform duration-300 ease-in-out"
      ></div>
    </div>
    <span v-if="label" class="mr-3 text-sm font-medium text-gray-900">{{ label }}</span>
  </label>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: () => `toggle-${Math.random().toString(36).substr(2, 9)}`,
  },
});

defineEmits(['update:modelValue']);
</script>
