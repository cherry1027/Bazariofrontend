const BASE_URL = "http://localhost:5000/";

export async function fetchAPI(endpoint, method = "GET", body = null, auth = false) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}
