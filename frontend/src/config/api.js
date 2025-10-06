const API_BASE_URL = 'http://localhost:3000/api';

export const AUTH_API = {
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  GET_USER: `${API_BASE_URL}/auth/user`,
};

// Example for other API endpoints as the project grows:
// export const PROFILE_API = {
//   GET: `${API_BASE_URL}/profile`,
//   UPDATE: `${API_BASE_URL}/profile`,
// };
