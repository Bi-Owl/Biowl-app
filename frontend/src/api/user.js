import { USER_API, REPORT_CARD_API } from '@/config/api';
import { getAuthHeaders, handleResponse } from './utils';

export const getLatestReportCardSummary = async () => {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(REPORT_CARD_API.GET_LATEST_SUMMARY, { headers });
        return handleResponse(response);
    } catch (error) {
        throw error;
    }
};

export const getCompletedExamsCount = async () => {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(USER_API.COMPLETED_COUNT, { headers });
        return handleResponse(response);
    } catch (error) {
        throw error;
    }
};

export const getTotalExamsCount = async () => {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(USER_API.TOTAL_EXAMS, { headers });
        return handleResponse(response);
    } catch (error) {
        throw error;
    }
};
