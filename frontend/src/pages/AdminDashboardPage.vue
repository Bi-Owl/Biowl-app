<template>
  <div class="relative flex min-h-screen">
    <!-- Admin Side Menu -->
    <AdminSideMenu 
      class="h-screen fixed top-0 right-0"
      :current-view="currentView"
      @navigate="handleNavigation"
    />

    <!-- Main Content Area -->
    <div class="mr-64 flex-grow flex flex-col p-8">
      <div class="w-full bg-white rounded-lg shadow-md p-8 flex-grow">
        <UsersTable v-if="currentView === 'users'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AdminSideMenu from '@/components/dashboard/AdminSideMenu.vue';
import UsersTable from '@/components/dashboard/UsersTable.vue';

const currentView = ref('users'); // Default view

const handleNavigation = (view) => {
  currentView.value = view;
};
</script>
