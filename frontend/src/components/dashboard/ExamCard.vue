<template>
  <div class="border rounded-lg p-4 shadow-sm flex flex-col h-full" :class="isPurchased ? 'bg-green-50' : 'bg-white'">
    <div class="flex-grow">
      <h3 class="text-lg font-semibold mb-2 text-gray-800">{{ exam.name }}</h3>
      <p class="text-gray-600 text-sm mb-4 whitespace-pre-wrap">{{ exam.description }}</p>
    </div>
    <hr class="my-4" />
    <div class="text-sm text-gray-500">
      <div class="flex justify-between items-center">
        <span>قیمت:</span>
        <span class="font-bold" :class="isFree ? 'text-green-600' : 'text-gray-800'">
          {{ priceText }}
        </span>
      </div>
      <div v-if="exam.duration" class="flex justify-between items-center mt-2">
        <span>مدت زمان:</span>
        <span>{{ exam.duration }} دقیقه</span>
      </div>
      <div v-if="exam.startTime && !isTimeless" class="flex justify-between items-center mt-2">
        <span>زمان شروع:</span>
        <span>{{ new Date(exam.startTime).toLocaleString('fa-IR') }}</span>
      </div>
      <div v-if="exam.endTime && !isTimeless" class="flex justify-between items-center mt-1">
        <span>زمان پایان:</span>
        <span>{{ new Date(exam.endTime).toLocaleString('fa-IR') }}</span>
      </div>
    </div>
    <div class="mt-6">
      <!-- Purchase Action -->
      <div v-if="actionType === 'purchase'">
        <button
          v-if="!exam.isPurchasable"
          disabled
          class="w-full bg-gray-400 text-white py-2 rounded-md cursor-not-allowed">
          غیرقابل خرید
        </button>
        <button 
          v-else-if="isPurchased"
          disabled
          class="w-full bg-green-600 text-white py-2 rounded-md cursor-not-allowed">
          خریداری شده
        </button>
        <button 
          v-else
          @click="$emit('purchase', exam)"
          :disabled="isPurchasing"
          class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-wait">
          {{ isPurchasing ? 'در حال خرید...' : 'خرید' }}
        </button>
      </div>
      <!-- Start/Continue/Review Action -->
      <div v-if="actionType === 'start'">
        <div class="text-center mb-2 space-y-1">
          <div v-if="isBeforeStart && exam.attempt?.status !== 'completed'" class="text-sm text-amber-700 font-semibold">
            {{ countdownText }}
          </div>
          <div v-if="inProgressCountdown" class="text-sm text-yellow-600 font-semibold">
            زمان باقی‌مانده: {{ inProgressCountdown }}
          </div>
        </div>
        <button 
          @click="$emit('handle-action', exam)" 
          :disabled="startActionState.disabled"
          class="w-full text-white py-2 rounded-md transition-colors"
          :class="[startActionState.class, { 'cursor-not-allowed': startActionState.disabled }]"
        >
          {{ startActionState.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  exam: {
    type: Object,
    required: true,
  },
  isPurchased: {
    type: Boolean,
    default: false,
  },
  isPurchasing: {
    type: Boolean,
    default: false,
  },
  actionType: {
    type: String,
    default: 'purchase', // can be 'purchase' or 'start'
  }
});

const emit = defineEmits(['purchase', 'handle-action', 'attempt-expired']);

const now = ref(new Date());
let timer = null;
let inProgressTimer = null;

const remainingTime = ref(0);

// --- General Timer for 'now' ---
onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
  if (inProgressTimer) clearInterval(inProgressTimer);
});

// --- In-Progress Exam Countdown Logic ---
const setupInProgressCountdown = () => {
  if (props.exam.attempt?.status === 'in_progress' && props.exam.duration && props.exam.attempt.startedAt) {
    const endTime = new Date(props.exam.attempt.startedAt).getTime() + props.exam.duration * 60 * 1000;
    
    const update = () => {
      const newRemaining = endTime - new Date().getTime();
      if (newRemaining > 0) {
        remainingTime.value = newRemaining;
      } else {
        remainingTime.value = 0;
        emit('attempt-expired', props.exam.id);
        if (inProgressTimer) clearInterval(inProgressTimer);
      }
    };

    update();
    inProgressTimer = setInterval(update, 1000);
  }
};

watch(() => props.exam.attempt, (newAttempt) => {
  if (inProgressTimer) clearInterval(inProgressTimer);
  if (newAttempt?.status === 'in_progress') {
    setupInProgressCountdown();
  }
}, { immediate: true });


const inProgressCountdown = computed(() => {
  if (props.exam.attempt?.status !== 'in_progress' || remainingTime.value <= 0) {
    return null;
  }
  const totalSeconds = Math.floor(remainingTime.value / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});


// --- Other Computed Properties ---
const isFree = computed(() => props.exam.price === 'free');

const priceText = computed(() => {
  if (isFree.value) return 'رایگان';
  return `${Number(props.exam.price).toLocaleString('fa-IR')} تومان`;
});

const isTimeless = computed(() => !props.exam.startTime);
const startTime = computed(() => props.exam.startTime ? new Date(props.exam.startTime) : null);
const endTime = computed(() => props.exam.endTime ? new Date(props.exam.endTime) : null);

const isBeforeStart = computed(() => startTime.value && now.value < startTime.value);
const isAfterEnd = computed(() => endTime.value && now.value > endTime.value);

const startActionState = computed(() => {
  const status = props.exam.attempt?.status;

  if (status === 'completed') {
    return { text: 'مشاهده پاسخنامه', disabled: false, class: 'bg-sky-600 hover:bg-sky-700' };
  }

  if (!isTimeless.value) {
    if (isAfterEnd.value) {
      return { text: 'زمان آزمون تمام شده', disabled: true, class: 'bg-red-500' };
    }
    if (isBeforeStart.value) {
      return { text: 'شروع آزمون', disabled: true, class: 'bg-gray-400' };
    }
  }

  if (status === 'in_progress') {
    return { text: 'ادامه آزمون', disabled: false, class: 'bg-yellow-500 hover:bg-yellow-600' };
  }
  
  return { text: 'شروع آزمون', disabled: false, class: 'bg-emerald-600 hover:bg-emerald-700' };
});

const countdownText = computed(() => {
  if (!isBeforeStart.value) return '';
  const diff = startTime.value.getTime() - now.value.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (days > 0) return `شروع تا ${days} روز دیگر`;
  return `شروع تا: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});
</script>
