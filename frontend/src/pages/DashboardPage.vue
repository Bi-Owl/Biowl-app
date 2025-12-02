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
        <UserProfileView v-if="currentView === 'profile'" />
        <MyExams v-else-if="currentView === 'my-exams'" :current-view="currentView" />
        <Store v-else-if="currentView === 'store'" />
        <MyReportCards v-else-if="currentView === 'report-cards'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SideMenu from '@/components/dashboard/SideMenu.vue';
import MyExams from '@/components/dashboard/MyExams.vue';
import Store from '@/components/dashboard/Store.vue';
import MyReportCards from '@/components/dashboard/MyReportCards.vue';
import UserProfileView from '@/components/dashboard/UserProfileView.vue'; // Import the new component

const currentView = ref('profile'); // Default view

const handleNavigation = (view) => {
  currentView.value = view;
};
</script>
