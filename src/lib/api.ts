export type AppRole = "admin" | "doctor" | "patient";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: AppRole;
  phone?: string;
  avatarUrl?: string;
}

export interface ApiErrorPayload {
  message?: string;
  error?: string;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const TOKEN_STORAGE_KEY = "careconnect_auth_token";

export const getApiBaseUrl = () => API_BASE;

export const getStoredToken = () => localStorage.getItem(TOKEN_STORAGE_KEY) || "";
export const setStoredToken = (token: string) => localStorage.setItem(TOKEN_STORAGE_KEY, token);
export const clearStoredToken = () => localStorage.removeItem(TOKEN_STORAGE_KEY);

const toApiError = async (response: Response) => {
  let message = "Request failed";
  try {
    const body = (await response.json()) as ApiErrorPayload;
    message = body.message || body.error || message;
  } catch {
    message = response.statusText || message;
  }
  throw new Error(message);
};

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(init.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    await toApiError(response);
  }

  return response.json() as Promise<T>;
}

export async function apiDownload(path: string): Promise<Blob> {
  const token = getStoredToken();
  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    headers,
  });
  if (!response.ok) {
    await toApiError(response);
  }

  return response.blob();
}
