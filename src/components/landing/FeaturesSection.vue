<template>
    <section id="about-us" class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="lg:text-center">
                <h2 class="text-base text-emerald-600 font-semibold tracking-wide uppercase" data-aos="fade-up">چرا بیول؟</h2>
                <p class="mt-4 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl" data-aos="fade-up">
                    بهترین روش‌های آموزش المپیاد
                </p>
            </div>

            <div class="mt-12">
                <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <FeatureCard 
                        v-for="feature in features" 
                        :key="feature.title" 
                        :icon="feature.icon" 
                        :title="feature.title" 
                        :description="feature.description"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import FeatureCard from '../ui/FeatureCard.vue';

const features = [
    {
        icon: 'users',
        title: 'مربیان با تجربه',
        description: 'مربیان ما از مدال‌آوران المپیادهای کشوری هستند که تجربه شرکت در المپیاد دارند.'
    },
    {
        icon: 'book-open',
        title: 'منابع اختصاصی',
        description: 'منابع آموزشی اختصاصی و به‌روز شده مطابق با آخرین تغییرات المپیاد.'
    },
    {
        icon: 'activity',
        title: 'آزمون‌های منظم',
        description: 'برگزاری آزمون‌های منظم و شبیه‌سازی شده برای سنجش پیشرفت دانش‌آموزان.'
    }
];
</script>