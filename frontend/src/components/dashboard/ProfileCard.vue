<template>
  <div class="flex items-center p-4 bg-emerald-500 rounded-full mb-8">
    <div class="w-16 h-16 rounded-full bg-emerald-200 flex-shrink-0">
      <!-- Placeholder for profile image -->
    </div>
    <div class="mr-4 text-white">
      <p class="font-bold text-lg">{{ userFullName }}</p>
      <p class="text-sm">خوش آمدید</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { auth } from '@/auth';

const userFullName = computed(() => {
  if (auth.state.user) {
    return `${auth.state.user.firstName} ${auth.state.user.lastName}`;
  }
  return 'کاربر مهمان';
});
</script>
