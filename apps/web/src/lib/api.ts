import { createApiClient } from "@research-assistant/api-client";

const publicBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";
const internalBaseUrl = process.env.API_BASE_URL_INTERNAL ?? publicBaseUrl;

const baseUrl = typeof window === "undefined" ? internalBaseUrl : publicBaseUrl;

export const apiClient = createApiClient({ baseUrl });
