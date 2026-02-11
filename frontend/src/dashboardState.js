import { reactive } from 'vue';

export const dashboardState = reactive({
    activeView: 'profile',
    selectedReportCardId: null,
});

export function navigateTo(view, reportCardId = null) {
    dashboardState.activeView = view;
    dashboardState.selectedReportCardId = reportCardId;
}
