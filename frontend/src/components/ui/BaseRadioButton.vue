<template>
  <label
    class="relative flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 group select-none"
    :class="[
      modelValue === value
        ? `${theme.activeBorder} ${theme.activeBg} shadow-sm`
        : `border-gray-100 bg-gray-50 ${theme.hoverBorder} hover:bg-white`,
      disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
    ]"
  >
    <input
      type="radio"
      class="sr-only"
      :value="value"
      :name="name"
      :checked="modelValue === value"
      @change="$emit('update:modelValue', value)"
      :disabled="disabled"
    >

    <!-- Custom Radio Circle -->
    <div
      class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0"
      :class="[
        modelValue === value
          ? `${theme.circleActiveBorder} ${theme.circleActiveBg}`
          : `border-gray-300 ${theme.circleHoverBorder}`
      ]"
    >
      <div
        class="w-2 h-2 rounded-full bg-white transition-all duration-300 transform"
        :class="modelValue === value ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
      ></div>
    </div>

    <!-- Label Content -->
    <div class="mr-3 flex flex-col">
      <span
        class="text-sm font-bold transition-colors duration-300"
        :class="modelValue === value ? theme.activeText : 'text-gray-600'"
      >
        <slot>{{ label }}</slot>
      </span>
      <span v-if="description" class="text-xs text-gray-400 font-medium">
        {{ description }}
      </span>
    </div>
  </label>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object],
    required: true
  },
  value: {
    type: [String, Number, Boolean, Object],
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: 'radio-group'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  activeColor: {
    type: String,
    default: 'emerald'
  }
});

defineEmits(['update:modelValue']);

// Static class dictionary so Tailwind CSS JIT compiler preserves all classes
const colorThemes = {
  emerald: {
    activeBorder: 'border-emerald-500',
    activeBg: 'bg-emerald-50',
    hoverBorder: 'hover:border-emerald-200',
    circleActiveBorder: 'border-emerald-500',
    circleActiveBg: 'bg-emerald-500',
    circleHoverBorder: 'group-hover:border-emerald-400',
    activeText: 'text-emerald-800',
  },
  red: {
    activeBorder: 'border-red-500',
    activeBg: 'bg-red-50',
    hoverBorder: 'hover:border-red-200',
    circleActiveBorder: 'border-red-500',
    circleActiveBg: 'bg-red-500',
    circleHoverBorder: 'group-hover:border-red-400',
    activeText: 'text-red-700',
  },
  blue: {
    activeBorder: 'border-blue-500',
    activeBg: 'bg-blue-50',
    hoverBorder: 'hover:border-blue-200',
    circleActiveBorder: 'border-blue-500',
    circleActiveBg: 'bg-blue-500',
    circleHoverBorder: 'group-hover:border-blue-400',
    activeText: 'text-blue-800',
  }
};

const theme = computed(() => colorThemes[props.activeColor] || colorThemes.emerald);
</script>
