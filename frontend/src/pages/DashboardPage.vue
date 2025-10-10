<template>
  <div class="relative flex min-h-screen">
    <!-- Side Menu -->
    <SideMenu 
      class="h-screen fixed top-0 right-0"
      :current-view="currentView"
      @navigate="handleNavigation"
    />

    <!-- Main Content Area -->
    <div class="mr-64 flex-grow flex flex-col p-8">
      <div class="w-full bg-white rounded-lg shadow-md p-8 flex-grow">
        <Profile v-if="currentView === 'profile'" />
        <MyExams v-else-if="currentView === 'my-exams'" />
        <Store v-else-if="currentView === 'store'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SideMenu from '@/components/dashboard/SideMenu.vue';
import MyExams from '@/components/dashboard/MyExams.vue';
import Store from '@/components/dashboard/Store.vue';

// A simple component for the profile view for now
const Profile = {
  template: `<div><h1 class="text-2xl font-bold text-gray-800">پروفایل کاربری</h1><p class="mt-2 text-gray-600">اطلاعات پروفایل شما در اینجا نمایش داده می‌شود.</p></div>`
};

const currentView = ref('profile'); // Default view

const handleNavigation = (view) => {
  currentView.value = view;
};
</script>
