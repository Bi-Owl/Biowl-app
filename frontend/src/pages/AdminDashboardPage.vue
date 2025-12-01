<template>
  <div class="relative flex min-h-screen">
    <!-- Admin Side Menu -->
    <AdminSideMenu 
      class="h-screen fixed top-0 right-0"
      :current-view="currentView"
      @navigate="handleNavigation"
    />

    <!-- Main Content Area -->
    <div class="mr-64 flex-grow flex flex-col p-8">
      <div class="w-full bg-white rounded-lg shadow-md p-8 flex-grow">
        <UsersTable v-if="currentView === 'users'" />
        
        <div v-if="currentView === 'exams'">
          <ExamsTable />
        </div>

        <div v-if="currentView === 'questions'">
          <QuestionManager 
            v-if="selectedExamForQuestions"
            :exam="selectedExamForQuestions"
            @back="selectedExamForQuestions = null"
          />
          <ExamsTable 
            v-else 
            :is-selection-mode="true"
            @manage-questions="handleManageQuestions"
          />
        </div>
        <ReportCardTable v-if="currentView === 'report-cards'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AdminSideMenu from '@/components/dashboard/AdminSideMenu.vue';
import UsersTable from '@/components/dashboard/UsersTable.vue';
import ExamsTable from '@/components/dashboard/ExamsTable.vue';
import QuestionManager from '@/components/dashboard/QuestionManager.vue';
import ReportCardTable from '@/components/dashboard/ReportCardTable.vue';

const currentView = ref('users'); // Default view
const selectedExamForQuestions = ref(null);

const handleNavigation = (view) => {
  currentView.value = view;
  // Reset selection when changing main view
  selectedExamForQuestions.value = null; 
};

const handleManageQuestions = (exam) => {
  selectedExamForQuestions.value = exam;
};
</script>
