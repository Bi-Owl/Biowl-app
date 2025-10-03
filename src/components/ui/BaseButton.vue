<template>
    <div :class="['inline-block', shadow ? 'rounded-md shadow' : '']">
        <a :href="href" :class="['flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md md:py-4 md:text-lg md:px-10 btn-hover', variantClass]">
            <slot></slot>
        </a>
    </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
    href: {
        type: String,
        default: '#'
    },
    variant: {
        type: String,
        default: 'primary' // primary or secondary
    },
    shadow: {
        type: Boolean,
        default: true
    }
});

const variantClass = computed(() => {
    if (props.variant === 'primary') {
        return 'text-white bg-emerald-600 hover:bg-emerald-700';
    }
    return 'text-emerald-600 bg-white hover:bg-gray-50';
});
</script>

<style scoped>
.btn-hover {
    transition: all 0.3s ease;
}

.btn-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
</style>
