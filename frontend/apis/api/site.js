import { apiRequest } from "../utils/http";

export const SITE_API_SPECS = {
  recordSiteVisit: {
    title: "특정사이트 방문",
    method: "POST",
    endpoint: "/site-visits",
    serverReady: false
  }
};

/** 특정사이트 방문 */
export const recordSiteVisit = ({ url, visitedAt }) =>
  apiRequest({
    endpoint: SITE_API_SPECS.recordSiteVisit.endpoint,
    method: "POST",
    body: {
      url,
      visitedAt: visitedAt || new Date().toISOString()
    }
  });
