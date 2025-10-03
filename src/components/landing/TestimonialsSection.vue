<template>
    <section id="mentors" class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="lg:text-center">
                <h2 class="text-base text-emerald-600 font-semibold tracking-wide uppercase" data-aos="fade-up">نظرات دانش‌آموزان</h2>
                <p class="mt-4 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl" data-aos="fade-up">
                    تجربیات موفق
                </p>
            </div>

            <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                <TestimonialCard 
                    v-for="testimonial in testimonials" 
                    :key="testimonial.name" 
                    :image="testimonial.image" 
                    :name="testimonial.name" 
                    :role="testimonial.role" 
                    :quote="testimonial.quote"
                />
            </div>
        </div>
    </section>
</template>

<script setup>
import TestimonialCard from '../ui/TestimonialCard.vue';

const testimonials = [
    {
        image: 'http://static.photos/people/200x200/1',
        name: 'محمد حسینی',
        role: 'مدال طلا المپیاد جهانی ۱۴۰۱',
        quote: 'دوره‌های بیول کاملاً من را برای المپیاد آماده کرد. منابع آموزشی و راهنمایی‌های مربیان بی‌نظیر بود.'
    },
    {
        image: 'http://static.photos/people/200x200/2',
        name: 'فاطمه محمدی',
        role: 'مدال نقره المپیاد کشوری ۱۴۰۰',
        quote: 'روش تدریس متفاوت و آزمون‌های منظم بیول باعث شد در مدت کوتاهی پیشرفت چشمگیری داشته باشم.'
    },
    {
        image: 'http://static.photos/people/200x200/3',
        name: 'علی رضایی',
        role: 'مدال برنز المپیاد کشوری ۱۴۰۲',
        quote: 'به عنوان کسی که از شهرستان در این دوره‌ها شرکت کردم، باید بگویم کیفیت آموزش آنلاین بیول واقعاً عالی بود.'
    }
];
</script>