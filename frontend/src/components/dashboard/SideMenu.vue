<template>
  <aside class="w-64 bg-white p-6 shadow-md flex-shrink-0 flex flex-col">
    <ProfileCard />
    <nav class="flex-grow mt-8">
      <ul>
        <li @click="$emit('navigate', 'profile')" 
            :class="[currentView === 'profile' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600']"
            class="flex items-center text-lg font-semibold py-3 px-4 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer">
          <i data-feather="user" class="ml-3"></i>
          <span>پروفایل</span>
        </li>
        <li @click="$emit('navigate', 'my-exams')" 
            :class="[currentView === 'my-exams' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600']"
            class="flex items-center text-lg font-semibold py-3 px-4 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer mt-2">
          <i data-feather="file-text" class="ml-3"></i>
          <span>آزمون‌های من</span>
        </li>
        <li @click="$emit('navigate', 'store')" 
            :class="[currentView === 'store' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600']"
            class="flex items-center text-lg font-semibold py-3 px-4 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer mt-2">
          <i data-feather="shopping-cart" class="ml-3"></i>
          <span>فروشگاه</span>
        </li>
      </ul>
    </nav>
    <!-- Logout Button -->
    <div class="mt-auto">
      <button @click="handleLogout" class="flex items-center w-full text-lg font-semibold text-red-500 py-3 px-4 rounded-lg hover:bg-red-50 transition-colors">
        <i data-feather="log-out" class="ml-3"></i>
        <span>خروج</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import feather from 'feather-icons';
import ProfileCard from './ProfileCard.vue';
import { auth } from '@/auth';

defineProps({
  currentView: {
    type: String,
    required: true,
  },
});

const router = useRouter();

const handleLogout = () => {
  auth.logout();
  router.push('/auth');
};

onMounted(() => {
  feather.replace();
});
</script>