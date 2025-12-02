import { auth } from '@/auth';

export const getAuthHeaders = () => {
  const token = auth.state.token;
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }), // Only add auth header if token exists
  };
};

export const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'خطایی رخ داد.');
  }
  return data;
};
