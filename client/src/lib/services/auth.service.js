import { request, setToken, clearToken } from './api.js';

// --- Auth endpoints ---
export const auth = {
  async register({ name, email, password }) {
    const data = await request("/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
    if (data?.token) setToken(data.token);
    return data;
  },
  async login({ email, password }) {
    const data = await request("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    if (data?.token) setToken(data.token);
    return data;
  },
  async logout() {
    const data = await request("/auth/logout", { method: "POST", body: {} });
    clearToken();
    return data;
  },
  me() {
    return request("/auth/me");
  },
};