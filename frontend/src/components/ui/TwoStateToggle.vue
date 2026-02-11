<template>
  <div 
    class="relative w-full h-11 rounded-xl p-1 flex items-center cursor-pointer select-none border group overflow-hidden transition-all duration-300"
    :class="[
      modelValue === rightValue ? rightBgClass : leftBgClass, 
      modelValue === rightValue ? rightBorderClass : leftBorderClass
    ]"
    @click="toggle"
  >
    <!-- Sliding Background (The Active State Plate) -->
    <div 
      class="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-transform duration-300 ease-out border border-gray-100 z-0"
      :style="{ 
        transform: modelValue === rightValue ? 'translateX(0)' : 'translateX(-100%)', 
        right: '4px' 
      }"
    ></div>
    
    <!-- Right Option (Visible/Active in our logic) -->
    <div 
      class="relative z-10 flex-1 flex items-center justify-center gap-2 text-sm font-extrabold transition-all duration-300"
      :class="modelValue === rightValue ? rightColorClass : 'text-gray-400'"
    >
      <slot name="right-icon"></slot>
      {{ rightLabel }}
    </div>

    <!-- Left Option (Hidden/Inactive in our logic) -->
    <div 
      class="relative z-10 flex-1 flex items-center justify-center gap-2 text-sm font-extrabold transition-all duration-300"
      :class="modelValue === leftValue ? leftColorClass : 'text-gray-400'"
    >
      <slot name="left-icon"></slot>
      {{ leftLabel }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [Boolean, String, Number],
    required: true
  },
  rightLabel: {
    type: String,
    required: true
  },
  leftLabel: {
    type: String,
    required: true
  },
  rightValue: {
    type: [Boolean, String, Number],
    default: true
  },
  leftValue: {
    type: [Boolean, String, Number],
    default: false
  },
  rightBgClass: {
    type: String,
    default: 'bg-gray-100'
  },
  leftBgClass: {
    type: String,
    default: 'bg-gray-100'
  },
  rightColorClass: {
    type: String,
    default: 'text-blue-600'
  },
  leftColorClass: {
    type: String,
    default: 'text-blue-600'
  },
  rightBorderClass: {
    type: String,
    default: 'border-gray-200'
  },
  leftBorderClass: {
    type: String,
    default: 'border-gray-200'
  }
});

const emit = defineEmits(['update:modelValue']);

const toggle = () => {
  const newValue = props.modelValue === props.rightValue ? props.leftValue : props.rightValue;
  emit('update:modelValue', newValue);
};
</script>

<style scoped>
/* No specific styles needed as we handle RTL via 'right' and 'translateX(-100%)' which moves left */
</style>
