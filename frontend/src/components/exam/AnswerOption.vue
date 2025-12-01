<template>
  <div
    @click="selectOption"
    :class="[
      'flex items-center p-4 rounded-lg border-2 transition-all duration-200 ease-in-out relative',
      isReadonly ? reviewModeClasses : interactiveModeClasses,
      { 'cursor-not-allowed': isReadonly || isPending, 'border-yellow-400 animate-pulse-border': isPending }
    ]"
  >
    <div
      :class="[
        'w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg font-mono transition-colors duration-200 shrink-0',
        isReadonly ? reviewModeCircleClasses : interactiveModeCircleClasses,
        { 'bg-yellow-400 text-white': isPending }
      ]"
    >
      <svg v-if="isPending" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span v-else>{{ optionNumber }}</span>
    </div>
    <div class="mr-4 text-gray-800 grow">
      <slot>گزینه {{ optionNumber }}</slot>
    </div>
    <div v-if="isReadonly && isCorrect" class="absolute top-2 left-2 text-xs bg-green-500 text-white rounded-full px-2 py-0.5">
      گزینه صحیح
    </div>
    <div v-if="isReadonly && isSelected && !isCorrect" class="absolute top-2 left-2 text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
      انتخاب شما
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  optionNumber: {
    type: [Number, String],
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  isReadonly: {
    type: Boolean,
    default: false
  },
  isPending: {
    type: Boolean,
    default: false
  },
  isCorrect: {
    type: Boolean,
    default: false
  },
  wasAnswered: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['select']);

const selectOption = () => {
  if (!props.isReadonly && !props.isPending) {
    emit('select', props.optionNumber);
  }
};

// --- Computed Classes for different modes ---

const interactiveModeClasses = computed(() => ({
  'bg-emerald-100 border-emerald-500 shadow-md': props.isSelected && !props.isPending,
  'bg-white border-gray-200': !props.isSelected && !props.isPending,
  'cursor-pointer hover:bg-emerald-50 hover:border-emerald-300': true,
}));

const interactiveModeCircleClasses = computed(() => ({
  'bg-emerald-500 text-white': props.isSelected && !props.isPending,
  'bg-emerald-100 text-emerald-800': !props.isSelected && !props.isPending,
}));

const reviewModeClasses = computed(() => {
  // Correct answer is always green
  if (props.isCorrect) {
    return 'bg-green-100 border-green-500';
  }
  // User's incorrect selection is always red
  if (props.isSelected) {
    return 'bg-red-100 border-red-500';
  }
  // For options that are neither correct nor selected by the user
  if (props.wasAnswered) {
    // If user answered (and it was wrong), other options are neutral gray
    return 'bg-gray-50 border-gray-200 opacity-60';
  } else {
    // If user did not answer, other options are faint blue
    return 'bg-blue-50 border-blue-200 opacity-80';
  }
});

const reviewModeCircleClasses = computed(() => {
  if (props.isCorrect) {
    return 'bg-green-500 text-white';
  }
  if (props.isSelected) {
    return 'bg-red-500 text-white';
  }
  if (props.wasAnswered) {
    return 'bg-gray-200 text-gray-500';
  } else {
    return 'bg-blue-100 text-blue-800';
  }
});

</script>
