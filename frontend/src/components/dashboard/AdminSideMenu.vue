<template>
  <aside class="w-64 bg-white p-6 shadow-md flex-shrink-0 flex flex-col">
    <nav class="flex-grow mt-8">
      <ul>
        <li @click="$emit('navigate', 'users')" 
            :class="[currentView === 'users' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600']"
            class="flex items-center text-lg font-semibold py-3 px-4 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer">
          <i data-feather="users" class="ml-3"></i>
          <span>کاربر ها</span>
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
import { adminAuth } from '@/adminAuth';

defineProps({
  currentView: {
    type: String,
    required: true,
  },
});

const router = useRouter();

const handleLogout = () => {
  adminAuth.logout();
  router.push('/admin');
};

onMounted(() => {
  feather.replace();
});
</script>