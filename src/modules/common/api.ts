import createClient from "openapi-fetch";
import type { paths } from "@/schema";

const API_URL = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let refreshQueue: ((success: boolean) => void)[] = [];

async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    return response.ok;
  } catch {
    return false;
  }
}

export const fetchClient = createClient<paths>({
  baseUrl: API_URL,
  credentials: "include",
});

const pendingRequests = new Map<string, Request>();
const retriedRequests = new Set<string>();

fetchClient.use({
  onRequest({ request, id }) {
    pendingRequests.set(id, request.clone());
    return request;
  },

  async onResponse({ response, id }) {
    const clone = pendingRequests.get(id);
    pendingRequests.delete(id);

    if (response.status !== 401 || !clone) return;

    if (
      clone.url.includes("/auth/logout") ||
      clone.url.includes("/auth/refresh")
    )
      return;

    if (retriedRequests.has(id)) {
      retriedRequests.delete(id);
      window.dispatchEvent(new Event("auth-unauthorized"));
      return;
    }

    if (isRefreshing) {
      const success = await new Promise<boolean>((resolve) => [
        ...refreshQueue,
        resolve,
      ]);
      if (!success) return;

      retriedRequests.add(id);
      return fetch(new Request(clone, { credentials: "include" }));
    }

    isRefreshing = true;
    const success = await refreshAccessToken();
    isRefreshing = false;

    if (!success) {
      refreshQueue.forEach((resolve) => resolve(false));
      refreshQueue = [];
      window.dispatchEvent(new Event("auth-unauthorized"));
      return;
    }

    refreshQueue.forEach((resolve) => resolve(true));
    refreshQueue = [];

    retriedRequests.add(id);
    return fetch(new Request(clone, { credentials: "include" }));
  },

  onError({ id }) {
    pendingRequests.delete(id);
    retriedRequests.delete(id);
  },
});
