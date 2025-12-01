import { adminAuth } from '@/adminAuth';
import { ADMIN_API } from '@/config/api';

const getHeaders = () => {
  const token = adminAuth.state.token;
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const getUsers = async () => {
  const response = await fetch(ADMIN_API.GET_USERS, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to fetch users');
  }
  return response.json();
};

export const getUserById = async (id) => {
  const response = await fetch(ADMIN_API.GET_USER_BY_ID(id), {
    headers: getHeaders(),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to fetch user');
  }
  return response.json();
};

export const updateUser = async (id, userData) => {
  const response = await fetch(ADMIN_API.UPDATE_USER(id), {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to update user');
  }
  return response.json();
};

export const deleteUser = async (id) => {

  const response = await fetch(ADMIN_API.DELETE_USER(id), {

    method: 'DELETE',

    headers: getHeaders(),

  });

  if (!response.ok) {

    const data = await response.json();

    throw new Error(data.message || 'Failed to delete user');

  }

  return response.json();

};



// --- Exam Management ---



export const createExam = async (examData) => {

  const response = await fetch(ADMIN_API.CREATE_EXAM, {

    method: 'POST',

    headers: getHeaders(),

    body: JSON.stringify(examData),

  });

  if (!response.ok) {

    const data = await response.json();

    throw new Error(data.message || 'Failed to create exam');

  }

  return response.json();

};



export const getExams = async () => {

  const response = await fetch(ADMIN_API.GET_EXAMS, {

    headers: getHeaders(),

  });

  if (!response.ok) {

    const data = await response.json();

    throw new Error(data.message || 'Failed to fetch exams');

  }

  return response.json();

};



export const getExamById = async (id) => {

  const response = await fetch(ADMIN_API.GET_EXAM_BY_ID(id), {

    headers: getHeaders(),

  });

  if (!response.ok) {

    const data = await response.json();

    throw new Error(data.message || 'Failed to fetch exam');

  }

  return response.json();

};



export const updateExam = async (id, examData) => {

  const response = await fetch(ADMIN_API.UPDATE_EXAM(id), {

    method: 'PUT',

    headers: getHeaders(),

    body: JSON.stringify(examData),

  });

  if (!response.ok) {

    const data = await response.json();

    throw new Error(data.message || 'Failed to update exam');

  }

  return response.json();

};



export const deleteExam = async (id) => {
  const response = await fetch(ADMIN_API.DELETE_EXAM(id), {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to delete exam');
  }
  return response.json();
};

// --- Question Management ---

const getMultipartHeaders = () => {
  const token = adminAuth.state.token;
  if (!token) {
    throw new Error('Authentication token not found.');
  }
  // For multipart/form-data, we let the browser set the Content-Type
  return {
    'Authorization': `Bearer ${token}`,
  };
};

export const getQuestionsForExam = async (examId) => {
  const response = await fetch(ADMIN_API.GET_QUESTIONS_FOR_EXAM(examId), {
    headers: getHeaders(),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to fetch questions');
  }
  return response.json();
};

export const createQuestion = async (examId, formData) => {
  const response = await fetch(ADMIN_API.CREATE_QUESTION(examId), {
    method: 'POST',
    headers: getMultipartHeaders(),
    body: formData,
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to create question');
  }
  return response.json();
};

export const updateQuestion = async (questionId, formData) => {
  const response = await fetch(ADMIN_API.UPDATE_QUESTION(questionId), {
    method: 'PUT',
    headers: getMultipartHeaders(),
    body: formData,
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to update question');
  }
  return response.json();
};

export const deleteQuestion = async (questionId) => {
  const response = await fetch(ADMIN_API.DELETE_QUESTION(questionId), {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to delete question');
  }
  return response.json();
};

export const reorderQuestions = async (updates) => {
  const response = await fetch(ADMIN_API.REORDER_QUESTIONS, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ updates }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to reorder questions');
  }
  return response.json();
};

// --- Report Card Management ---

export const getExamsWithReportCardStatus = async () => {
  const response = await fetch(ADMIN_API.GET_EXAMS_WITH_REPORT_CARD_STATUS, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to fetch exams with report card status');
  }
  return response.json();
};

export const publishReportCard = async (examId, formData) => {
  const response = await fetch(ADMIN_API.PUBLISH_REPORT_CARD(examId), {
    method: 'POST',
    headers: getMultipartHeaders(), // Use multipart for potential file upload
    body: formData,
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to publish report card');
  }
  return response.json();
};

export const updateReportCard = async (examId, formData) => {
  // PUT method doesn't work as expected with multipart/form-data in some setups,
  // so we use POST and can handle it on the backend or just use PUT. Sticking to PUT for RESTfulness.
  const response = await fetch(ADMIN_API.UPDATE_REPORT_CARD(examId), {
    method: 'PUT',
    headers: getMultipartHeaders(),
    body: formData,
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to update report card');
  }
  return response.json();
};
