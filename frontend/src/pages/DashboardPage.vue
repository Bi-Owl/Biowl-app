<template>
  <div class="flex h-screen">
    <!-- Side Menu -->
    <SideMenu class="h-full sticky top-0" />

    <!-- Main Content Area -->
    <div class="flex-grow p-8">
      <div class="w-full h-full bg-white rounded-lg shadow-md p-8">
        <h1 class="text-2xl font-bold text-gray-800">به داشبورد خود خوش آمدید</h1>
        <p class="mt-2 text-gray-600">اینجا محتوای اصلی داشبورد شما قرار می‌گیرد.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import SideMenu from '@/components/dashboard/SideMenu.vue';
</script>
