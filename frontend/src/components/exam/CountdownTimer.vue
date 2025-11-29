<template>
  <div class="text-center p-2">
    <p class="text-sm font-medium text-gray-700 mb-1">زمان باقی‌مانده</p>
    <div class="grid grid-flow-col gap-x-2 text-emerald-600">
      <div class="p-1">
        <div class="text-xl font-bold">{{ String(hours).padStart(2, '0') }}</div>
        <div class="text-xs text-emerald-500">ساعت</div>
      </div>
      <div class="p-1">
        <div class="text-xl font-bold">{{ String(minutes).padStart(2, '0') }}</div>
        <div class="text-xs text-emerald-500">دقیقه</div>
      </div>
      <div class="p-1">
        <div class="text-xl font-bold">{{ String(seconds).padStart(2, '0') }}</div>
        <div class="text-xs text-emerald-500">ثانیه</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  initialTime: {
    type: Number,
    required: true // Time in milliseconds
  }
});

const emit = defineEmits(['finished']);

const remainingTime = ref(props.initialTime);

const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

let timerInterval = null;

const updateTimer = () => {
  if (remainingTime.value > 0) {
    const totalSeconds = Math.floor(remainingTime.value / 1000);
    hours.value = Math.floor(totalSeconds / 3600);
    minutes.value = Math.floor((totalSeconds % 3600) / 60);
    seconds.value = totalSeconds % 60;
    remainingTime.value -= 1000;
  } else {
    hours.value = 0;
    minutes.value = 0;
    seconds.value = 0;
    clearInterval(timerInterval);
    emit('finished');
  }
};

watch(() => props.initialTime, (newTime) => {
  remainingTime.value = newTime;
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  if (newTime > 0) {
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  }
}, { immediate: true });


onMounted(() => {
  if (props.initialTime > 0) {
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  }
});

onUnmounted(() => {
  clearInterval(timerInterval);
});
</script>
