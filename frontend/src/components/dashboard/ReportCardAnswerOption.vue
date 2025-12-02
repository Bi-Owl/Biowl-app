<template>
  <div
    :class="[
      'flex items-center p-4 rounded-lg border-2 transition-all duration-200 ease-in-out relative',
      computedClasses,
      'cursor-not-allowed'
    ]"
  >
    <div
      :class="[
        'w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg font-mono transition-colors duration-200 shrink-0',
        computedCircleClasses
      ]"
    >
      <span>{{ optionNumber }}</span>
    </div>
    <div class="mr-4 text-gray-800 grow">
      <slot>گزینه {{ optionNumber }}</slot>
    </div>
    
    <!-- Labels for Report Card -->
    <div v-if="label" :class="['absolute top-1.5 left-2 text-xs text-white rounded-full px-2 py-0.5 shadow', label.bgColor]">
      {{ label.text }}
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
  userAnswer: {
    type: [Number, String, null],
    default: null
  },
  correctAnswer: {
    type: [Number, String, null],
    required: true
  }
});

const isSelected = computed(() => props.userAnswer === props.optionNumber);
const isCorrect = computed(() => props.correctAnswer === props.optionNumber);
const wasAnswered = computed(() => props.userAnswer !== null && props.userAnswer !== undefined);

const computedClasses = computed(() => {
  // Correctly selected
  if (isCorrect.value && isSelected.value) {
    return 'bg-green-100 border-green-500';
  }
  // Incorrectly selected by user
  if (!isCorrect.value && isSelected.value) {
    return 'bg-red-100 border-red-500';
  }
  // The correct option, but not selected by user
  if (isCorrect.value && !isSelected.value) {
    return 'bg-green-100 border-green-500';
  }
  // Unanswered question, options should be light blue
  if (!wasAnswered.value) {
      return 'bg-blue-50 border-blue-200 opacity-80';
  }
  // Other options in a question that was answered
  return 'bg-gray-50 border-gray-200 opacity-60';
});

const computedCircleClasses = computed(() => {
  // Correctly selected
  if (isCorrect.value && isSelected.value) {
    return 'bg-green-500 text-white';
  }
  // Incorrectly selected by user
  if (!isCorrect.value && isSelected.value) {
    return 'bg-red-500 text-white';
  }
  // The correct option, but not selected by user
  if (isCorrect.value && !isSelected.value) {
    return 'bg-green-500 text-white';
  }
  // Unanswered question
  if (!wasAnswered.value) {
      return 'bg-blue-100 text-blue-800';
  }
  // Other options
  return 'bg-gray-200 text-gray-500';
});

const label = computed(() => {
  // Correctly selected
  if (isCorrect.value && isSelected.value) {
    return { text: 'انتخاب شما - گزینه درست', bgColor: 'bg-green-500' };
  }
  // Incorrectly selected by user
  if (!isCorrect.value && isSelected.value) {
    return { text: 'پاسخ شما', bgColor: 'bg-red-500' };
  }
  // The correct option, when user answered incorrectly
  if (isCorrect.value && !isSelected.value && wasAnswered.value) {
    return { text: 'گزینه درست', bgColor: 'bg-green-500' };
  }
  // The correct option, when user did not answer
  if (isCorrect.value && !isSelected.value && !wasAnswered.value) {
    return { text: 'پاسخ درست - نزده', bgColor: 'bg-green-500' };
  }
  return null;
});
</script>
