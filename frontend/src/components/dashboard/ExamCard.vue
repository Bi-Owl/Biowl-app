<template>
  <div class="border rounded-lg p-4 shadow-sm bg-white flex flex-col h-full">
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
      <div v-if="exam.startTime" class="flex justify-between items-center mt-2">
        <span>زمان شروع:</span>
        <span>{{ new Date(exam.startTime).toLocaleString('fa-IR') }}</span>
      </div>
      <div v-if="exam.endTime" class="flex justify-between items-center mt-1">
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
      <!-- Start Action -->
      <div v-if="actionType === 'start'">
        <!-- Timeless Exam -->
        <button v-if="isTimeless" @click="$emit('start', exam)" class="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors">
          شروع آزمون
        </button>
        <!-- Timed Exam -->
        <div v-else>
          <div v-if="isBeforeStart" class="text-center">
            <div class="text-sm text-amber-700 font-semibold">{{ countdownText }}</div>
            <button disabled class="w-full mt-2 bg-gray-400 text-white py-2 rounded-md cursor-not-allowed">
              شروع آزمون
            </button>
          </div>
          <button v-else-if="isDuringExam" @click="$emit('start', exam)" class="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors">
            شروع آزمون
          </button>
          <button v-else-if="isAfterEnd" disabled class="w-full bg-red-500 text-white py-2 rounded-md cursor-not-allowed">
            زمان آزمون تمام شده است
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

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

defineEmits(['purchase', 'start']);

const now = ref(new Date());
let timer = null;

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});

const isFree = computed(() => props.exam.price === 'free');

const priceText = computed(() => {
  if (isFree.value) {
    return 'رایگان';
  }
  return `${Number(props.exam.price).toLocaleString('fa-IR')} تومان`;
});

// --- Timed Exam Logic ---
const isTimeless = computed(() => !props.exam.startTime);
const startTime = computed(() => props.exam.startTime ? new Date(props.exam.startTime) : null);
const endTime = computed(() => props.exam.endTime ? new Date(props.exam.endTime) : null);

const isBeforeStart = computed(() => startTime.value && now.value < startTime.value);
const isAfterEnd = computed(() => endTime.value && now.value > endTime.value);
const isDuringExam = computed(() => {
  if (isTimeless.value) return true;
  const afterStart = startTime.value ? now.value >= startTime.value : true;
  const beforeEnd = endTime.value ? now.value < endTime.value : true;
  return afterStart && beforeEnd;
});

const countdownText = computed(() => {
  if (!isBeforeStart.value) return '';

  const diff = startTime.value.getTime() - now.value.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (days > 0) {
    return `شروع تا ${days} روز دیگر`;
  }
  
  return `شروع تا: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});
</script>
