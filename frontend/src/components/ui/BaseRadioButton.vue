<template>
  <label 
    class="relative flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 group select-none"
    :class="[
      modelValue === value 
        ? `border-${activeColor}-500 bg-${activeColor}-50 shadow-sm` 
        : `border-gray-100 bg-gray-50 hover:border-${activeColor}-200 hover:bg-white`,
      disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
    ]"
  >
    <input 
      type="radio" 
      class="hidden" 
      :value="value" 
      :name="name"
      :checked="modelValue === value"
      @change="$emit('update:modelValue', value)"
      :disabled="disabled"
    >
    
    <!-- Custom Radio Circle -->
    <div 
      class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300"
      :class="[
        modelValue === value 
          ? `border-${activeColor}-500 bg-${activeColor}-500` 
          : `border-gray-300 group-hover:border-${activeColor}-400`
      ]"
    >
      <div 
        class="w-2 h-2 rounded-full bg-white transition-all duration-300 transform"
        :class="modelValue === value ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
      ></div>
    </div>

    <!-- Label Content -->
    <div class="mr-3 flex flex-col">
      <span 
        class="text-sm font-bold transition-colors duration-300"
        :class="modelValue === value ? `text-${activeColor}-900` : 'text-gray-600'"
      >
        <slot>{{ label }}</slot>
      </span>
      <span v-if="description" class="text-xs text-gray-400 font-medium">
        {{ description }}
      </span>
    </div>
  </label>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object],
    required: true
  },
  value: {
    type: [String, Number, Boolean, Object],
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: 'radio-group'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  activeColor: {
    type: String,
    default: 'emerald'
  }
});

defineEmits(['update:modelValue']);
</script>
