<template>
  <div class="bg-white rounded-3xl shadow-lg border border-gray-100/80 p-6 transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-gray-200">
    <h3 class="flex items-center text-lg font-bold text-emerald-800 mb-6">
      <span class="bg-emerald-100 text-emerald-700 rounded-full w-8 h-8 flex items-center justify-center me-3 font-mono">{{ question.position }}</span>
      سوال
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
      <!-- Report Card Mode -->
      <template v-if="viewMode === 'report-card'">
        <ReportCardAnswerOption
          v-for="optionNum in question.numberOfOptions"
          :key="optionNum"
          :option-number="optionNum"
          :user-answer="selectedAnswer"
          :correct-answer="correctAnswer"
        />
      </template>

      <!-- Interactive or Answer Sheet Mode -->
      <template v-else>
        <AnswerOption
          v-for="optionNum in question.numberOfOptions"
          :key="optionNum"
          :option-number="optionNum"
          :is-selected="selectedAnswer === optionNum"
          :is-readonly="isReadonly"
          :is-pending="pendingUpdate && pendingUpdate.questionId === question.id && pendingUpdate.answer === optionNum"
          :is-question-unanswered="!wasAnswered"
          @select="onSelectAnswer"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { STATIC_BASE_URL } from '@/config/api';
import AnswerOption from './AnswerOption.vue';
import ReportCardAnswerOption from '../dashboard/ReportCardAnswerOption.vue';

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
  selectedAnswer: {
    type: [Number, String, null],
    default: null
  },
  isReadonly: {
    type: Boolean,
    default: false
  },
  pendingUpdate: {
    type: Object,
    default: null
  },
  correctAnswer: {
    type: [Number, String, null],
    default: null
  },
  viewMode: {
    type: String,
    default: 'interactive', // interactive, answer-sheet, report-card
  }
});

const emit = defineEmits(['update-answer']);

const wasAnswered = computed(() => props.selectedAnswer !== null && props.selectedAnswer !== undefined);

const onSelectAnswer = (optionNumber) => {
  if (props.isReadonly) return;

  // If the user clicks the same answer again, we de-select it.
  const newAnswer = props.selectedAnswer === optionNumber ? null : optionNumber;
  emit('update-answer', {
    questionId: props.question.id,
    answer: newAnswer
  });
};
</script>
