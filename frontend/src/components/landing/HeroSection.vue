<script setup>
import BaseButton from '../ui/BaseButton.vue';
</script>

<template>
  <section>
    <div class="max-w-7xl mx-auto py-12 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1
          class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl leading-loose"
          data-aos="fade-up"
        >
          <span class="block py-2">تیم المپیاد زیست‌شناسی</span>
          <span class="block gradient-text py-2">بیول | Biowl</span>
        </h1>
        <p
          class="mt-4 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-6 md:text-xl md:max-w-3xl"
          data-aos="fade-up"
        >
          پرورش استعدادهای برتر زیست‌شناسی برای المپیادهای کشوری و جهانی
        </p>
        <div
          class="mt-6 max-w-md mx-auto sm:flex sm:justify-center md:mt-10 space-x-4 space-x-reverse"
          data-aos="fade-up"
        >
          <BaseButton variant="primary">
            ثبت نام
            <i data-feather="arrow-left" class="mr-2 w-4 h-4"></i>
          </BaseButton>
          <BaseButton variant="secondary">
            اطلاعات بیشتر
            <i data-feather="info" class="mr-2 w-4 h-4"></i>
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>
