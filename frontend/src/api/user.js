import { getAuthHeaders, handleResponse } from './utils';

export const getLatestReportCardSummary = async () => {
    try {
        const headers = getAuthHeaders();
        const response = await fetch('/api/report-cards/latest-summary', { headers });
        return handleResponse(response);
    } catch (error) {
        throw error.message; // handleResponse already parses message
    }
};

export const getCompletedExamsCount = async () => {
    try {
        const headers = getAuthHeaders();
        const response = await fetch('/api/users/me/completed-exams-count', { headers });
        return handleResponse(response);
    } catch (error) {
        throw error.message;
    }
};

export const getTotalExamsCount = async () => {
    try {
        const headers = getAuthHeaders();
        const response = await fetch('/api/exams/total', { headers });
        return handleResponse(response);
    } catch (error) {
        throw error.message;
    }
};
