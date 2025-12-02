<template>
  <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white min-h-[160px] flex flex-col justify-between">
    <div>
      <h3 class="text-xl font-bold mb-2">آزمون بعدی شما</h3>
      <template v-if="nextExam">
        <p class="text-lg font-semibold">{{ nextExam.name }}</p>
        <p class="text-sm opacity-90 mb-2">{{ new Date(nextExam.startTime).toLocaleDateString('fa-IR') }}</p>
        <div class="flex items-center text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock mr-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span v-if="timeLeft.total > 0">{{ formatTime(timeLeft) }}</span>
          <span v-else>آزمون شروع شده است!</span>
        </div>
      </template>
      <p v-else class="text-lg opacity-90">در حال حاضر آزمون بعدی در دسترس نیست.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { fetchPurchasedExams } from '@/api/exams';

const toast = useToast();
const nextExam = ref(null);
const timer = ref(null);
const timeLeft = ref({
  total: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
});

const calculateTimeLeft = () => {
  if (!nextExam.value || !nextExam.value.startTime) return;

  const now = new Date();
  const examStartTime = new Date(nextExam.value.startTime);
  const total = examStartTime.getTime() - now.getTime();

  if (total < 0) {
    timeLeft.value = { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    clearInterval(timer.value);
    return;
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  timeLeft.value = {
    total,
    days,
    hours,
    minutes,
    seconds
  };
};

const formatTime = (time) => {
  const parts = [];
  if (time.days > 0) parts.push(`${time.days} روز`);
  if (time.hours > 0) parts.push(`${time.hours} ساعت`);
  if (time.minutes > 0) parts.push(`${time.minutes} دقیقه`);
  if (time.seconds > 0 || parts.length === 0) parts.push(`${time.seconds} ثانیه`);
  return parts.join(' و ');
};

onMounted(async () => {
  try {
    const exams = await fetchPurchasedExams();
    const now = new Date();
    
    const upcomingExams = exams
      .filter(exam => new Date(exam.startTime).getTime() > now.getTime())
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
    if (upcomingExams.length > 0) {
      nextExam.value = upcomingExams[0];
      calculateTimeLeft();
      timer.value = setInterval(calculateTimeLeft, 1000);
    }
  } catch (error) {
    if (error.status === 404) {
      // It's possible there are no purchased exams, which is not a critical error.
      console.info('No purchased exams found.');
    } else {
      toast.error('خطا در دریافت آزمون‌های بعدی.');
      console.error('Error fetching upcoming exams:', error);
    }
  }
});

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>