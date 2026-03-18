import createClient from "openapi-fetch";
import type { paths } from "@/schema";

const API_URL = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let refreshQueue: ((token: string | null) => void)[] = [];

const pendingRequests = new Map<string, Request>();

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const { token, refreshToken: newRefreshToken } = await res.json();
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", newRefreshToken);
    return token;
  } catch {
    return null;
  }
}

export const fetchClient = createClient<paths>({ baseUrl: API_URL });

fetchClient.use({
  onRequest({ request, id }) {
    pendingRequests.set(id, request.clone());

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const headers = new Headers(request.headers);
    headers.set("Authorization", `Bearer ${token}`);
    return new Request(request, { headers });
  },

  async onResponse({ response, id }) {
    const clone = pendingRequests.get(id);
    pendingRequests.delete(id);

    if (response.status !== 401 || !clone) return;

    if (!localStorage.getItem("refreshToken")) {
      window.dispatchEvent(new Event("auth-unauthorized"));
      return;
    }

    if (isRefreshing) {
      const newToken = await new Promise<string | null>((resolve) =>
        refreshQueue.push(resolve),
      );
      if (!newToken) return;

      const headers = new Headers(clone.headers);
      headers.set("Authorization", `Bearer ${newToken}`);
      return fetch(new Request(clone, { headers }));
    }

    isRefreshing = true;
    const newToken = await refreshAccessToken();
    isRefreshing = false;

    if (!newToken) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      refreshQueue.forEach((resolve) => resolve(null));
      refreshQueue = [];
      window.dispatchEvent(new Event("auth-unauthorized"));
      return;
    }

    refreshQueue.forEach((resolve) => resolve(newToken));
    refreshQueue = [];

    const headers = new Headers(clone.headers);
    headers.set("Authorization", `Bearer ${newToken}`);
    return fetch(new Request(clone, { headers }));
  },

  onError({ id }) {
    pendingRequests.delete(id);
  },
});
