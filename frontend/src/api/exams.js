import { EXAM_API, REPORT_CARD_API } from '@/config/api';
import { getAuthHeaders, handleResponse } from './utils';

export const fetchPublicExams = async () => {
  try {
    const response = await fetch(EXAM_API.GET_ALL);
    return handleResponse(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchPurchasedExams = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(EXAM_API.GET_PURCHASED, { headers });
    return handleResponse(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const purchaseExam = async (examId) => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(EXAM_API.PURCHASE(examId), {
      method: 'POST',
      headers,
    });
    return handleResponse(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getExamAuthHeaders = (examToken) => {
  if (!examToken) throw new Error('توکن آزمون برای این عملیات الزامی است.');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${examToken}`,
  };
};

export const startExamAttempt = async (examId) => {
  try {
    const headers = getAuthHeaders(); // Uses the standard login token
    const response = await fetch(EXAM_API.START_ATTEMPT(examId), {
      method: 'POST',
      headers,
    });
    return handleResponse(response);
  } catch (error) {
    console.error('API Error starting exam:', error);
    throw error;
  }
};

export const updateAnswer = async (attemptId, questionId, answer, examToken) => {
  try {
    const headers = getExamAuthHeaders(examToken);
    const body = JSON.stringify({ questionId, answer });
    const response = await fetch(EXAM_API.UPDATE_ANSWER(attemptId), {
      method: 'PUT',
      headers,
      body,
    });
    return handleResponse(response);
  } catch (error) {
    console.error('API Error updating answer:', error);
    throw error;
  }
};

export const finishExamAttempt = async (attemptId) => {
  try {
    const headers = getAuthHeaders(); // Use standard auth
    const response = await fetch(EXAM_API.FINISH_ATTEMPT(attemptId), {
      method: 'POST',
      headers,
    });
    return handleResponse(response);
  } catch (error) {
    console.error('API Error finishing exam:', error);
    throw error;
  }
};

export const reviewAttempt = async (attemptId) => {
  try {
    const headers = getAuthHeaders(); // Uses standard login token
    const response = await fetch(EXAM_API.REVIEW_ATTEMPT(attemptId), { headers });
    return handleResponse(response);
  } catch (error) {
    console.error('API Error reviewing attempt:', error);
    throw error;
  }
};

export const fetchAvailableReportCards = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(REPORT_CARD_API.GET_AVAILABLE, { headers });
    return handleResponse(response);
  } catch (error) {
    console.error('API Error fetching report cards:', error);
    throw error;
  }
};

export const fetchReportCardDetails = async (examId) => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(REPORT_CARD_API.GET_DETAILS(examId), { headers });
    return handleResponse(response);
  } catch (error) {
    console.error('API Error fetching report card details:', error);
    throw error;
  }
};

