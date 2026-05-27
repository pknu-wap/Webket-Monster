import { DEFAULT_USER_ID } from "../config/constants";
import { apiRequest } from "../utils/http";

export const ITEM_API_SPECS = {
  acquireItem: {
    title: "아이템 얻기",
    method: "POST",
    endpoint: "/items/acquire",
    serverReady: true
  },
  useItem: {
    title: "아이템 사용하기",
    method: "GET",
    endpoint: "/items/{userItemId}/use",
    serverReady: true
  },
  discardItem: {
    title: "아이템 버리기",
    method: "DELETE",
    endpoint: "/items/{userItemId}",
    serverReady: true
  },
  reorderItems: {
    title: "아이템 위치 바꾸기",
    method: "PATCH",
    endpoint: "/items/reorder",
    serverReady: true
  }
};

/** 아이템 얻기 */
export const acquireItem = ({ itemId, userId = DEFAULT_USER_ID }) =>
  apiRequest({
    endpoint: ITEM_API_SPECS.acquireItem.endpoint,
    method: "POST",
    userId,
    body: { itemId }
  });

/** 아이템 사용하기 */
export const useItem = ({ userItemId, userId = DEFAULT_USER_ID }) =>
  apiRequest({
    endpoint: `/items/${userItemId}/use`,
    userId
  });

/** 아이템 버리기 */
export const discardItem = ({ userItemId, userId = DEFAULT_USER_ID }) =>
  apiRequest({
    endpoint: `/items/${userItemId}`,
    method: "DELETE",
    userId
  });

/** 아이템 위치 바꾸기 */
export const reorderItems = ({ itemOrderList, userId = DEFAULT_USER_ID }) =>
  apiRequest({
    endpoint: ITEM_API_SPECS.reorderItems.endpoint,
    method: "PATCH",
    userId,
    body: { itemOrderList }
  });
