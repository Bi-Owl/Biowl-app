import { AUTH_API } from '@/config/api';
import { handleResponse } from './utils';

export const login = async (email, password) => {
  const response = await fetch(AUTH_API.LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const signup = async (userData) => {
  const response = await fetch(AUTH_API.REGISTER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const adminLogin = async (username, password) => {
  const response = await fetch(AUTH_API.ADMIN_LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(response);
};
