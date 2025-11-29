<template>
  <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 transition-shadow hover:shadow-xl">
    <h3 class="text-xl font-bold text-emerald-800 mb-4">
      سوال {{ question.position }}
    </h3>
    <div class="mb-6">
      <img
        v-if="question.imageUrl"
        :src="STATIC_BASE_URL + question.imageUrl"
        alt="تصویر سوال"
        class="w-full h-auto rounded-lg object-contain"
      />
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <AnswerOption
        v-for="optionNum in question.numberOfOptions"
        :key="optionNum"
        :option-number="optionNum"
        :is-selected="selectedAnswer === optionNum"
        @select="onSelectAnswer"
      />
    </div>
  </div>
</template>

<script setup>
import AnswerOption from './AnswerOption.vue';

const STATIC_BASE_URL = 'http://localhost:3000';

const props = defineProps({
  question: {
    type: Object,
    required: true,
    // validator: (q) => q.id && q.position && q.imageUrl && q.numberOfOptions
  },
  selectedAnswer: {
    type: [Number, String, null],
    default: null
  }
});

const emit = defineEmits(['update-answer']);

const onSelectAnswer = (optionNumber) => {
  // If the user clicks the same answer again, we de-select it.
  const newAnswer = props.selectedAnswer === optionNumber ? null : optionNumber;
  emit('update-answer', {
    questionId: props.question.id,
    answer: newAnswer
  });
};
</script>
