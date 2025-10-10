<template>
  <div class="flex h-screen">
    <!-- Admin Side Menu -->
    <AdminSideMenu 
      class="h-full sticky top-0"
      :current-view="currentView"
      @navigate="handleNavigation"
    />

    <!-- Main Content Area -->
    <div class="flex-grow p-8 overflow-y-auto">
      <div class="w-full h-full bg-white rounded-lg shadow-md p-8">
        <div v-if="currentView === 'users'">
          <!-- Placeholder for users management -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AdminSideMenu from '@/components/dashboard/AdminSideMenu.vue';

const currentView = ref('users'); // Default view

const handleNavigation = (view) => {
  currentView.value = view;
};
</script>
