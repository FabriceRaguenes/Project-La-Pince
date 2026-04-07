const BASE = import.meta.env.VITE_API_URL;

export function getToken() {
  return localStorage.getItem("token");
}
export function clearToken() {
  localStorage.removeItem("token");
}
export function setToken(token) {
  localStorage.setItem("token", token);
}

export async function request(
  path,
  { method = "GET", body, headers = {} } = {},
) {
  const finalHeaders = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
    ...headers,
  };
  const token = getToken();
  if (token) finalHeaders.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error(" Erreur serveur:", txt);
    throw new Error(txt || `Erreur API ${res.status}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : null;
}
