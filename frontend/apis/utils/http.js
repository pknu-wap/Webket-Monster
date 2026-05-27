import { API_BASE_URL, API_HEADERS } from "../config/constants";

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const buildUrl = (endpoint, query) => {
  const normalizedBaseUrl = API_BASE_URL.replace(/\/$/, "");
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${normalizedBaseUrl}${normalizedEndpoint}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
};

export const apiRequest = async ({
  endpoint,
  method = "GET",
  body,
  headers,
  query,
  userId
}) => {
  const requestHeaders = {
    ...(body !== undefined ? { "Content-Type": API_HEADERS.JSON } : {}),
    ...(userId !== undefined ? { [API_HEADERS.USER_ID]: String(userId) } : {}),
    ...headers
  };

  const response = await fetch(buildUrl(endpoint, query), {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new ApiError(`API request failed: ${method} ${endpoint}`, {
      status: response.status,
      data
    });
  }

  return data || null;
};
