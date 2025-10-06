<template>
  <aside class="w-64 bg-white p-6 shadow-md flex-shrink-0 flex flex-col">
    <ProfileCard />
    <nav class="flex-grow">
      <ul>
        <li>
          <a href="#" class="flex items-center text-lg font-semibold text-emerald-700 py-3 px-4 rounded-lg hover:bg-emerald-50 transition-colors">
            <i data-feather="grid" class="ml-3"></i>
            <span>داشبورد</span>
          </a>
        </li>
        <li>
          <a href="#" class="flex items-center text-lg font-semibold text-gray-600 py-3 px-4 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
            <i data-feather="file-text" class="ml-3"></i>
            <span>آزمون ها</span>
          </a>
        </li>
        <li>
          <a href="#" class="flex items-center text-lg font-semibold text-gray-600 py-3 px-4 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
            <i data-feather="shopping-cart" class="ml-3"></i>
            <span>فروشگاه</span>
          </a>
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

const router = useRouter();

const handleLogout = () => {
  auth.logout();
  router.push('/auth');
};

onMounted(() => {
  feather.replace();
});
</script>