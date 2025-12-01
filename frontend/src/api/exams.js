import { auth } from '@/auth';
import { EXAM_API, REPORT_CARD_API } from '@/config/api';

const getAuthHeaders = () => {
  const token = auth.state.token;
  if (!token) {
    // This is not necessarily an error, as some endpoints can be public
    // The caller should handle cases where auth is required but no token is present.
    return { 'Content-Type': 'application/json' };
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const fetchPublicExams = async () => {
  try {
    const response = await fetch(EXAM_API.GET_ALL);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'خطایی در دریافت لیست آزمون‌ها رخ داد.');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to be caught by the component
  }
};

export const fetchPurchasedExams = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(EXAM_API.GET_PURCHASED, { headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'خطایی در دریافت آزمون‌های شما رخ داد.');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to be caught by the component
  }
};

export const purchaseExam = async (examId) => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(EXAM_API.PURCHASE(examId), {
      method: 'POST',
      headers,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'خطایی در فرآیند خرید رخ داد.');
    }
    return data;
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
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'خطایی در شروع آزمون رخ داد.');
    }
    return data;
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
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'خطایی در ذخیره پاسخ رخ داد.');
    }
    return data;
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
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'خطایی در پایان آزمون رخ داد.');
    }
    return data;
  } catch (error) {
    console.error('API Error finishing exam:', error);
    throw error;
  }
};

export const reviewAttempt = async (attemptId) => {
  try {
    const headers = getAuthHeaders(); // Uses standard login token
    const response = await fetch(EXAM_API.REVIEW_ATTEMPT(attemptId), { headers });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'خطایی در دریافت اطلاعات آزمون رخ داد.');
    }
    return data;
  } catch (error) {
    console.error('API Error reviewing attempt:', error);
    throw error;
  }
};

export const fetchAvailableReportCards = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(REPORT_CARD_API.GET_AVAILABLE, { headers });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to fetch report cards');
    }
    return response.json();
  } catch (error) {
    console.error('API Error fetching report cards:', error);
    throw error;
  }
};

export const fetchReportCardDetails = async (examId) => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(REPORT_CARD_API.GET_DETAILS(examId), { headers });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to fetch report card details');
    }
    return response.json();
  } catch (error) {
    console.error('API Error fetching report card details:', error);
    throw error;
  }
};
