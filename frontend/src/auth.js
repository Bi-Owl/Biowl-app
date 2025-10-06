import { reactive, readonly } from 'vue';
import { AUTH_API } from './config/api';

const state = reactive({
  user: null,
  token: null,
  // A flag to indicate when the initial auth check is complete
  isAuthCheckComplete: false,
});

const TOKEN_KEY = 'authToken';
const EXPIRATION_KEY = 'authTokenExpiration';
const EXPIRATION_HOURS = 24;

function login(authData) {
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + EXPIRATION_HOURS);

  localStorage.setItem(TOKEN_KEY, authData.token);
  localStorage.setItem(EXPIRATION_KEY, expiration.getTime());

  state.token = authData.token;
  state.user = { 
    id: authData.id, 
    email: authData.email,
    firstName: authData.firstName,
    lastName: authData.lastName,
  };
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRATION_KEY);
  state.token = null;
  state.user = null;
}

async function checkAuth() {
  const token = localStorage.getItem(TOKEN_KEY);
  const expirationTime = localStorage.getItem(EXPIRATION_KEY);

  if (!token || !expirationTime) {
    state.isAuthCheckComplete = true;
    return;
  }

  const now = new Date().getTime();
  if (now > parseInt(expirationTime, 10)) {
    logout();
    state.isAuthCheckComplete = true;
    return;
  }

  try {
    const response = await fetch(AUTH_API.GET_USER, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Token validation failed');
    }

    const userData = await response.json();
    state.token = token;
    state.user = userData;

  } catch (error) {
    console.error('Auth check failed:', error);
    logout();
  } finally {
    state.isAuthCheckComplete = true;
  }
}

export const auth = {
  state: readonly(state),
  login,
  logout,
  isAuthenticated: () => !!state.token,
  checkAuth,
};
