import { request } from "./api.js";

export const expenses = {
  list() {
    return request("/expenses");
  },
  listLimit(limit) {
    return request(`/expenses?limit=${encodeURIComponent(limit)}`);
  },
  byMonth(yyyyMm) {
    return request(`/expenses/by-month/${yyyyMm}`);
  },
  get(id) {
    return request(`/expenses/${id}`);
  },
  getTotal() {
    return request("/expenses/total");
  },
  create({ title, user_id, category_id, amount, date }) {
    return request("/expenses", {
      method: "POST",
      body: { title, user_id, category_id, amount, date },
    });
  },
  update(id, { title, category_id, amount, date }) {
    return request(`/expenses/${id}`, {
      method: "PATCH",
      body: { title, category_id, amount, date },
    });
  },
  remove(id) {
    return request(`/expenses/${id}`, { method: "DELETE" });
  },
};
