import { auth } from '@/auth';
import { EXAM_API } from '@/config/api';

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
      throw new Error('Failed to fetch public exams.');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchPurchasedExams = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(EXAM_API.GET_PURCHASED, { headers });
    if (!response.ok) {
      throw new Error('Failed to fetch purchased exams.');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const purchaseExam = async (examId) => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(EXAM_API.PURCHASE(examId), {
      method: 'POST',
      headers,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to purchase exam.');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
