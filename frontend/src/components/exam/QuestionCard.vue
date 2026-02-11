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
        <template v-if="question.type === 'numeric'">
            <div class="col-span-1 sm:col-span-2 p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div class="mb-2">
                    <span class="font-bold text-gray-700">پاسخ شما: </span>
                    <span :class="{'text-green-600': isNumericAnswerCorrect, 'text-red-600': !isNumericAnswerCorrect && wasAnswered, 'text-gray-500': !wasAnswered}" class="text-lg font-mono dir-ltr inline-block">
                        {{ wasAnswered ? selectedAnswer : 'پاسخ ندادید' }}
                    </span>
                </div>
                <div>
                    <span class="font-bold text-gray-700">پاسخ(های) صحیح: </span>
                    <span class="text-emerald-600 text-lg font-mono dir-ltr inline-block">
                        {{ formatNumericAnswer(correctAnswer) }}
                    </span>
                </div>
                <div v-if="wasAnswered" class="mt-2 text-sm font-medium">
                     <span v-if="isNumericAnswerCorrect" class="text-green-600 flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        صحیح
                     </span>
                     <span v-else class="text-red-600 flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        غلط
                     </span>
                </div>
            </div>
        </template>
        <template v-else>
            <ReportCardAnswerOption
            v-for="optionNum in question.numberOfOptions"
            :key="optionNum"
            :option-number="optionNum"
            :user-answer="selectedAnswer"
            :correct-answer="correctAnswer"
            />
        </template>
      </template>

      <!-- Interactive or Answer Sheet Mode -->
      <!-- Interactive or Answer Sheet Mode -->
      <template v-else>
        <template v-if="question.type === 'numeric'">
           <div class="col-span-1 sm:col-span-2">
              <label class="block mb-2 text-sm font-medium text-gray-700">پاسخ خود را وارد کنید:</label>
              <div class="relative">
                 <input 
                  type="text" 
                  inputmode="decimal"
                  :value="localAnswer" 
                  @input="onNumericInput"
                  :readonly="isReadonly"
                  class="bg-gray-50 border-2 border-gray-300 text-gray-900 text-lg rounded-lg outline-none block w-full p-4 dir-ltr transition-all duration-300" 
                  :class="{
                      '!bg-yellow-50 !border-yellow-400 !ring-4 !ring-yellow-100 animate-pulse-border': isSaving || isDebouncing,
                      '!bg-blue-100 !border-blue-500 !ring-4 !ring-blue-50': wasAnswered && !isSaving && !isDebouncing
                  }"
                  placeholder="عدد وارد کنید"
                 >
                 <div v-if="isSaving || isDebouncing" class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg class="animate-spin h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                 </div>
                 <div v-if="wasAnswered && !isSaving && !isDebouncing" class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                 </div>
              </div>
           </div>
        </template>
        <template v-else>
            <AnswerOption
            v-for="optionNum in question.numberOfOptions"
            :key="optionNum"
            :option-number="optionNum"
            :is-selected="selectedAnswer === optionNum"
            :is-readonly="isReadonly"
            :is-pending="pendingUpdate && pendingUpdate.questionId === question.id && pendingUpdate.answer === optionNum"
            @select="onSelectAnswer"
            />
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { STATIC_BASE_URL } from '@/config/api';
import AnswerOption from './AnswerOption.vue';
import ReportCardAnswerOption from '../dashboard/ReportCardAnswerOption.vue';
import { cleanNumericInput } from '@/utils/helpers';

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

const wasAnswered = computed(() => props.selectedAnswer !== null && props.selectedAnswer !== undefined && String(props.selectedAnswer).trim() !== '');
const isSaving = computed(() => props.pendingUpdate && props.pendingUpdate.questionId === props.question.id);
const isDebouncing = ref(false);
const localAnswer = ref('');

// Sync local value with prop when prop changes (but only if not currently debouncing)
watch(() => props.selectedAnswer, (newVal) => {
    if (!isDebouncing.value) {
        localAnswer.value = newVal === null || newVal === undefined ? '' : String(newVal);
    }
}, { immediate: true });

onMounted(() => {
    localAnswer.value = props.selectedAnswer === null || props.selectedAnswer === undefined ? '' : String(props.selectedAnswer);
});

const onSelectAnswer = (optionNumber) => {
  if (props.isReadonly) return;

  // If the user clicks the same answer again, we de-select it.
  const newAnswer = props.selectedAnswer === optionNumber ? null : optionNumber;
  emit('update-answer', {
    questionId: props.question.id,
    answer: newAnswer
  });
};

let debounceTimer = null;
const onNumericInput = (event) => {
    if (props.isReadonly) return;
    
    // Clean the input immediately
    const cleanValue = cleanNumericInput(event.target.value, false);
    
    // Update local state and input physically
    localAnswer.value = cleanValue;
    if (event.target.value !== cleanValue) {
        event.target.value = cleanValue;
    }

    isDebouncing.value = true;
    if (debounceTimer) clearTimeout(debounceTimer);
    
    debounceTimer = setTimeout(() => {
        isDebouncing.value = false;
        emit('update-answer', {
            questionId: props.question.id,
            answer: cleanValue
        });
    }, 1200); // 1.2s debounce to let user finish typing
};

const formatNumericAnswer = (answer) => {
  if (Array.isArray(answer)) {
    return answer.join(' یا ');
  }
   // Try to parse if it looks like a JSON array string
  if (typeof answer === 'string' && answer.startsWith('[') && answer.endsWith(']')) {
      try {
          const parsed = JSON.parse(answer);
          if (Array.isArray(parsed)) return parsed.join(' یا ');
      } catch (e) {
          // ignore
      }
  }
  return answer;
};

const isNumericAnswerCorrect = computed(() => {
    if (!wasAnswered.value || props.question.type !== 'numeric') return false;
    
    const userFloat = parseFloat(props.selectedAnswer);
    let correctAnswers = [];
    const correct = props.correctAnswer;
    
    if (Array.isArray(correct)) {
        correctAnswers = correct;
    } else if (typeof correct === 'string') {
        try {
            correctAnswers = JSON.parse(correct);
        } catch (e) {
            // Fallback for simple string or comma separated
            if (correct.includes(',')) {
                 correctAnswers = correct.split(',').map(s => parseFloat(s.trim()));
            } else {
                 correctAnswers = [parseFloat(correct)];
            }
        }
    } else if (typeof correct === 'number') {
        correctAnswers = [correct];
    }
    
    return correctAnswers.some(ans => Math.abs(parseFloat(ans) - userFloat) < 0.0001);
});
</script>
