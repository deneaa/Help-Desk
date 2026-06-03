const BASE_URL = "http://localhost:8080/api";

type RequestOptions = {
  method?: "GET" | "PATCH" | "PUT" | "POST" | "DELETE";
  body?: unknown;
  token?: string;
};

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (body !== undefined) {
    fetchOptions.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} - ${endpoint}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
};
