import api from "./apiClient.js";

export async function loginRequest(payload) {
  // payload: { email, password }
  const { data } = await api.post("/api/auth/login", payload);
  return data;
}

export async function signupRequest(payload) {
  // payload: { email, password }
  const { data } = await api.post("/api/auth/signup", payload);
  return data;
}
