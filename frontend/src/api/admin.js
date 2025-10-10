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