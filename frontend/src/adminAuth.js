import { reactive, readonly } from 'vue';

const state = reactive({
  admin: null,
  token: null,
  isAdminAuthCheckComplete: false,
});

const TOKEN_KEY = 'adminAuthToken';
const EXPIRATION_KEY = 'adminAuthTokenExpiration';
const EXPIRATION_HOURS = 1;

function login(authData) {
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + EXPIRATION_HOURS);

  localStorage.setItem(TOKEN_KEY, authData.token);
  localStorage.setItem(EXPIRATION_KEY, expiration.getTime());

  state.token = authData.token;
  state.admin = { id: authData.id };
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRATION_KEY);
  state.token = null;
  state.admin = null;
}

async function checkAuth() {
  const token = localStorage.getItem(TOKEN_KEY);
  const expirationTime = localStorage.getItem(EXPIRATION_KEY);

  if (!token || !expirationTime) {
    state.isAdminAuthCheckComplete = true;
    return;
  }

  const now = new Date().getTime();
  if (now > parseInt(expirationTime, 10)) {
    logout();
    state.isAdminAuthCheckComplete = true;
    return;
  }

  state.token = token;
  state.isAdminAuthCheckComplete = true;
}

export const adminAuth = {
  state: readonly(state),
  login,
  logout,
  isAuthenticated: () => !!state.token,
  checkAuth,
};
