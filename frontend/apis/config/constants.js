export const API_BASE_URL =
  process.env.PLASMO_PUBLIC_API_URL || "http://localhost:8080";

export const DEFAULT_USER_ID = 1;

export const API_HEADERS = {
  JSON: "application/json",
  USER_ID: "X-User-Id"
};
