<template>
  <div class="relative flex min-h-screen">
    <!-- Side Menu -->
    <SideMenu 
      class="h-screen fixed top-0 right-0"
      :current-view="dashboardState.activeView"
      @navigate="handleNavigation"
    />

    <!-- Main Content Area -->
    <div class="mr-64 flex-grow flex flex-col p-8">
      <div class="w-full bg-white rounded-lg shadow-md p-8 flex-grow">
        <UserProfileView v-if="dashboardState.activeView === 'profile'" />
        <MyExams v-else-if="dashboardState.activeView === 'my-exams'" :current-view="dashboardState.activeView" />
        <Store v-else-if="dashboardState.activeView === 'store'" />
        <MyReportCards v-else-if="dashboardState.activeView === 'report-cards'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { dashboardState } from '@/dashboardState';
import SideMenu from '@/components/dashboard/SideMenu.vue';
import MyExams from '@/components/dashboard/MyExams.vue';
import Store from '@/components/dashboard/Store.vue';
import MyReportCards from '@/components/dashboard/MyReportCards.vue';
import UserProfileView from '@/components/dashboard/UserProfileView.vue'; // Import the new component

const handleNavigation = (view) => {
  dashboardState.activeView = view;
  // Reset selected report card when navigating normally via menu
  dashboardState.selectedReportCardId = null;
};
</script>
