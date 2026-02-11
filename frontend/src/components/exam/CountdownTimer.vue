<template>
  <div 
    @click="isBlurred = !isBlurred"
    class="flex items-center gap-4 px-4 py-2 bg-gray-900/90 backdrop-blur-sm text-white rounded-full shadow-lg border border-white/10 cursor-pointer select-none transition-all duration-300 hover:bg-gray-800"
    :title="isBlurred ? 'نمایش زمان' : 'مخفی کردن زمان'"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="isBlurred ? 'text-gray-400' : 'text-emerald-400'"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
    
    <div 
      class="font-mono text-lg font-bold tracking-widest transition-all duration-300" 
      :class="[
        isLowTime ? 'text-red-400' : 'text-emerald-400',
        { 'blur-md select-none opacity-50': isBlurred }
      ]"
    >
      <span>{{ String(hours).padStart(2, '0') }}</span>:<span>{{ String(minutes).padStart(2, '0') }}</span>:<span>{{ String(seconds).padStart(2, '0') }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from 'vue';

const props = defineProps({
  initialTime: {
    type: Number,
    required: true // Time in milliseconds
  }
});

const emit = defineEmits(['finished']);

const remainingTime = ref(props.initialTime);
const isBlurred = ref(false);

const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

let timerInterval = null;

const isLowTime = computed(() => remainingTime.value < 5 * 60 * 1000); // Less than 5 minutes

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

onUnmounted(() => {
  clearInterval(timerInterval);
});
</script>
