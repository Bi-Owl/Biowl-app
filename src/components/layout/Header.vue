<template>
  <nav class="shadow-sm z-50 glassmorphism dynamic-island">
    <div class="max-w-7xl mx-auto px-1 sm:px-2 lg:px-4">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <i data-feather="award" class="text-emerald-600 w-8 h-8"></i>
            <span class="text-xl font-bold text-emerald-600 mr-2"
              >بیول | Biowl</span
            >
          </div>
        </div>
        <div class="hidden md:flex items-center space-x-2 space-x-reverse">
          <a
            href="#"
            class="text-emerald-600 px-3 py-2 rounded-md text-sm font-medium hover:scale-105 transition-transform"
            >خانه</a
          >
          <a
            href="#about-us"
            class="text-gray-600 hover:text-emerald-600 px-2 py-1 rounded-md text-sm font-medium hover:scale-105 transition-transform"
            >درباره ما</a
          >
          <a
            href="#programs"
            class="text-gray-600 hover:text-emerald-600 px-2 py-1 rounded-md text-sm font-medium hover:scale-105 transition-transform"
            >برنامه‌ها</a
          >
          <a
            href="#mentors"
            class="text-gray-600 hover:text-emerald-600 px-2 py-1 rounded-md text-sm font-medium hover:scale-105 transition-transform"
            >مربیان</a
          >
          <a
            href="#contact"
            class="text-gray-600 hover:text-emerald-600 px-2 py-1 rounded-md text-sm font-medium hover:scale-105 transition-transform"
            >تماس با ما</a
          >
        </div>
        <div class="md:hidden flex items-center">
          <button
            type="button"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 focus:outline-none"
          >
            <i data-feather="menu"></i>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup></script>

<style scoped>
.glassmorphism {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dynamic-island {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 600px;
  border-radius: 50px;
  padding: 10px 20px;
  z-index: 1000;
}
</style>
