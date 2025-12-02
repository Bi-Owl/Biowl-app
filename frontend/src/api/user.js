import axios from './axios';

export const getLatestReportCardSummary = async () => {
    try {
        const response = await axios.get('/api/report-cards/latest-summary');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

export const getCompletedExamsCount = async () => {
    try {
        const response = await axios.get('/api/users/me/completed-exams-count');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

export const getTotalExamsCount = async () => {
    try {
        const response = await axios.get('/api/exams/total');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};
