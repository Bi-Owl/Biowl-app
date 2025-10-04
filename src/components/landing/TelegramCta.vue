<script setup>
import BaseButton from '../ui/BaseButton.vue';
</script>

<template>
  <section class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:flex lg:items-center lg:justify-between">
        <div class="lg:w-1/2" data-aos="fade-up">
          <h2 class="text-3xl font-extrabold text-gray-900 leading-loose">
            <span class="block">کانال تلگرام بیول</span>
            <span class="block text-emerald-600">منبع اصلی آموزش‌های ما</span>
          </h2>
          <p class="mt-6 text-lg text-gray-600">
            تمامی آموزش‌ها، آزمون‌ها و منابع رایگان در کانال تلگرام ما منتشر
            می‌شود. برای دسترسی به جدیدترین مطالب آموزشی المپیاد زیست‌شناسی، عضو
            کانال ما شوید.
          </p>
          <div class="mt-10">
            <BaseButton variant="primary" :shadow="false">
              <i data-feather="send" class="ml-2 w-5 h-5"></i>
              عضویت در کانال
            </BaseButton>
          </div>
        </div>
        <div class="mt-10 lg:mt-0 lg:w-1/2" data-aos="fade-up">
          <div
            class="p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 glassmorphism"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-emerald-100 p-4 rounded-lg">
                <i data-feather="send" class="w-8 h-8 text-emerald-600"></i>
              </div>
              <div class="mr-6">
                <h4 class="text-lg font-bold text-gray-900">@Biowl_Oly</h4>
                <p class="text-sm text-gray-500">کانال رسمی تیم بیول</p>
              </div>
            </div>
            <div class="mt-8 grid grid-cols-2 gap-6">
              <div class="bg-emerald-50 p-4 rounded-lg">
                <div class="text-emerald-600 font-bold text-xl">۱۵۰+</div>
                <div class="text-sm text-gray-600">عضو فعال</div>
              </div>
              <div class="bg-emerald-50 p-4 rounded-lg">
                <div class="text-emerald-600 font-bold text-xl">۵۰+</div>
                <div class="text-sm text-gray-600">مطلب آموزشی</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.glassmorphism {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
