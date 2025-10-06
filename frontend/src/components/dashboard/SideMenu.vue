<template>
  <aside class="w-64 bg-white p-6 rounded-lg shadow-md flex-shrink-0">
    <ProfileCard />
    <nav>
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
  </aside>
</template>

<script setup>
import { onMounted } from 'vue';
import feather from 'feather-icons';
import ProfileCard from './ProfileCard.vue';

onMounted(() => {
  feather.replace();
});
</script>
