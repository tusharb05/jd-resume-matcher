import api from "./apiClient.js";

/**
 * Assumed backend expects multipart:
 * - resume (file)
 * - job_description (string)
 * If your backend uses different field names, change them here.
 */
export async function analyzeRequest({ file, jobDescription }) {
  const form = new FormData();

  form.append("file", file);
  form.append("jd", jobDescription);

  const { data } = await api.post("/api/analyze", form);
  return data;
}