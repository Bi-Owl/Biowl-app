<template>
  <div class="flex flex-col items-center justify-center py-10">
    <div class="w-full max-w-md">
      <!-- Modern Animated Switch -->
      <div class="relative w-64 mx-auto bg-emerald-50 p-1 rounded-full flex items-center mb-8">
        <div 
          class="absolute top-1 left-1 h-10 w-1/2 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out"
          :style="{ transform: activeTab === 'login' ? 'translateX(98%)' : 'translateX(0%)' }"
        ></div>
        <button @click="switchTab('login')" class="relative z-10 w-1/2 py-2 text-center font-semibold rounded-full transition-colors duration-300" :class="activeTab === 'login' ? 'text-emerald-600' : 'text-gray-500'">
          ورود
        </button>
        <button @click="switchTab('signup')" class="relative z-10 w-1/2 py-2 text-center font-semibold rounded-full transition-colors duration-300" :class="activeTab === 'signup' ? 'text-emerald-600' : 'text-gray-500'">
          ثبت نام
        </button>
      </div>

      <!-- Form Container with Sequential Fade Transition -->
      <div class="relative">
        <transition name="fade" mode="out-in">
          <component :is="activeTab === 'login' ? LoginForm : SignupForm" :key="activeTab" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef } from 'vue';
import LoginForm from '@/components/auth/LoginForm.vue';
import SignupForm from '@/components/auth/SignupForm.vue';

const activeTab = ref('login');

// Use shallowRef for components to avoid unnecessary deep reactivity
const components = {
  login: shallowRef(LoginForm),
  signup: shallowRef(SignupForm)
};

const switchTab = (tab) => {
  activeTab.value = tab;
};

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
