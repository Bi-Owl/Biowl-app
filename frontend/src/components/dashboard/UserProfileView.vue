<template>
  <div class="p-4 bg-gray-50 rounded-lg shadow-inner">
    <h1 class="text-3xl font-extrabold text-gray-800 mb-6">پروفایل کاربری</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Next Exam Card -->
      <NextExamCard />

      <!-- Last Report Card Card -->
      <LastReportCardCard />

      <!-- Exam Participation Card -->
      <ExamParticipationCard />
      
      <!-- Other useful info cards can go here -->
    </div>
  </div>
</template>

<script setup>
import NextExamCard from './NextExamCard.vue';
import LastReportCardCard from './LastReportCardCard.vue';
import ExamParticipationCard from './ExamParticipationCard.vue';

// No script logic needed here for now, data fetching will be in individual cards
</script>