import { request } from './api.js';

export const categories = {
  list() {
    return request("/categories");
  },
  get(id) {
    return request(`/categories/${id}`);
  },
  create({ name, color, icon, max_budget, user_id }) {
    return request("/categories", {
      method: "POST",
      body: { name, color, icon, max_budget, user_id },
    });
  },
  update(id, { name, color, icon, max_budget }) {
    return request(`/categories/${id}`, {
      method: "PATCH",
      body: { name, color, icon, max_budget },
    });
  },
  remove(id) {
    return request(`/categories/${id}`, { method: "DELETE" });
  },
};