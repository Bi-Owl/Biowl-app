const API_BASE_URL = 'http://localhost:3000/api';

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
};

export const ADMIN_API = {
  GET_USERS: `${API_BASE_URL}/admin/users`,
  GET_USER_BY_ID: (id) => `${API_BASE_URL}/admin/users/${id}`,
  UPDATE_USER: (id) => `${API_BASE_URL}/admin/users/${id}`,
  DELETE_USER: (id) => `${API_BASE_URL}/admin/users/${id}`,
};
