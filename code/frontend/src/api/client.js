// Real fetch wrapper for calling the AgriAid backend.
// Owner: Anisa Arora

const BASE_URL = 'http://localhost:4000/api';

async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) {
    const message = data?.error?.message || 'Request failed';
    throw new Error(message);
  }
  return data;
}

export default apiRequest;
