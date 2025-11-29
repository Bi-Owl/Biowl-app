<template>
  <div
    @click="selectOption"
    :class="[
      'flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ease-in-out',
      isSelected
        ? 'bg-emerald-100 border-emerald-500 shadow-md scale-105'
        : 'bg-white hover:bg-emerald-50 hover:border-emerald-300 border-gray-200'
    ]"
  >
    <div
      :class="[
        'w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors duration-200',
        isSelected
          ? 'bg-emerald-500 text-white'
          : 'bg-gray-200 text-gray-600'
      ]"
    >
      {{ optionNumber }}
    </div>
    <div class="mr-4">
      <slot>گزینه {{ optionNumber }}</slot> <!-- Fallback content -->
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  optionNumber: {
    type: [Number, String],
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['select']);

const selectOption = () => {
  emit('select', props.optionNumber);
};
</script>
