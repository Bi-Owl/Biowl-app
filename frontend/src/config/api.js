const API_BASE_URL = 'http://85.208.254.204:3000/api';
export const STATIC_BASE_URL = 'http://85.208.254.204:3000';

export const AUTH_API = {
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  GET_USER: `${API_BASE_URL}/auth/user`,
  ADMIN_LOGIN: `${API_BASE_URL}/admin/login`,
};

export const EXAM_API = {
  GET_ALL: `${API_BASE_URL}/exams`,
  GET_PURCHASED: `${API_BASE_URL}/exams/purchased`,
  PURCHASE: (examId) => `${API_BASE_URL}/exams/${examId}/purchase`,
  START_ATTEMPT: (examId) => `${API_BASE_URL}/exams/${examId}/start`,
  UPDATE_ANSWER: (attemptId) => `${API_BASE_URL}/attempts/${attemptId}/answer`,
  FINISH_ATTEMPT: (attemptId) => `${API_BASE_URL}/attempts/${attemptId}/finish`,
};

export const ADMIN_API = {
  GET_USERS: `${API_BASE_URL}/admin/users`,
  GET_USER_BY_ID: (id) => `${API_BASE_URL}/admin/users/${id}`,
  UPDATE_USER: (id) => `${API_BASE_URL}/admin/users/${id}`,
  DELETE_USER: (id) => `${API_BASE_URL}/admin/users/${id}`,

  // Exam management
  CREATE_EXAM: `${API_BASE_URL}/admin/exams`,
  GET_EXAMS: `${API_BASE_URL}/admin/exams`,
  GET_EXAM_BY_ID: (id) => `${API_BASE_URL}/admin/exams/${id}`,
  UPDATE_EXAM: (id) => `${API_BASE_URL}/admin/exams/${id}`,
  DELETE_EXAM: (id) => `${API_BASE_URL}/admin/exams/${id}`,

  // Question management
  GET_QUESTIONS_FOR_EXAM: (examId) => `${API_BASE_URL}/admin/exams/${examId}/questions`,
  CREATE_QUESTION: (examId) => `${API_BASE_URL}/admin/exams/${examId}/questions`,
  UPDATE_QUESTION: (questionId) => `${API_BASE_URL}/admin/questions/${questionId}`,
  DELETE_QUESTION: (questionId) => `${API_BASE_URL}/admin/questions/${questionId}`,
  REORDER_QUESTIONS: `${API_BASE_URL}/admin/questions/reorder`,
};
