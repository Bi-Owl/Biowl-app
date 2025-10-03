<template>
    <div class="p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 glassmorphism" data-aos="fade-up">
        <div class="flex items-center">
            <div class="flex-shrink-0">
                <img class="h-12 w-12 rounded-full" :src="image" alt="">
            </div>
            <div class="mr-4">
                <h4 class="text-lg font-medium text-gray-900">{{ name }}</h4>
                <p class="text-emerald-600">{{ role }}</p>
            </div>
        </div>
        <div class="mt-6">
            <p class="text-gray-600">
                "{{ quote }}"
            </p>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
    image: String,
    name: String,
    role: String,
    quote: String
});
</script>

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
