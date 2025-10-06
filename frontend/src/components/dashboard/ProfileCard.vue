<template>
  <div class="flex items-center p-3 bg-emerald-500 rounded-full mb-6">
    <div class="w-12 h-12 rounded-full bg-emerald-200 flex-shrink-0">
      <!-- Placeholder for profile image -->
    </div>
    <div class="mr-3 text-white">
      <p class="font-bold text-base">{{ userFullName }}</p>
      <p class="text-xs">خوش آمدید</p>
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
