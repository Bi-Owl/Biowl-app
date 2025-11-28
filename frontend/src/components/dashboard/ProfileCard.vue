<template>
  <div class="flex items-center p-3 bg-emerald-500 rounded-full mb-6">
    <div class="w-12 h-12 rounded-full bg-emerald-200 flex-shrink-0">
      <!-- Placeholder for profile image -->
    </div>
    <div class="mr-3 text-white">
      <p class="font-bold text-base">{{ userFullName }}</p>
      <p class="text-xs">خوش آمدید</p>
      <div v-if="walletBalance" class="flex items-center mt-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-credit-card"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
        <p class="text-sm font-semibold mr-1">{{ formattedWalletBalance }} <span class="text-xs">تومان</span></p>
      </div>
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

const walletBalance = computed(() => {
    return auth.state.user ? auth.state.user.wallet : 0;
});

const formattedWalletBalance = computed(() => {
    return new Intl.NumberFormat('fa-IR').format(walletBalance.value);
});
</script>
