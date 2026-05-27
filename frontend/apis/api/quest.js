import { apiRequest } from "../utils/http";

export const QUEST_API_SPECS = {
  getQuestList: {
    title: "퀘스트 목록 조회",
    method: "GET",
    endpoint: "/quests",
    serverReady: false
  },
  getMyQuests: {
    title: "내 퀘스트 조회",
    method: "GET",
    endpoint: "/users/me/quests",
    serverReady: false
  },
  receiveQuestReward: {
    title: "퀘스트 보상 받기",
    method: "POST",
    endpoint: "/quests/{questId}/reward",
    serverReady: false
  }
};

/** 퀘스트 목록 조회 */
export const getQuestList = () =>
  apiRequest({
    endpoint: QUEST_API_SPECS.getQuestList.endpoint
  });

/** 내 퀘스트 조회 */
export const getMyQuests = () =>
  apiRequest({
    endpoint: QUEST_API_SPECS.getMyQuests.endpoint
  });

/** 퀘스트 보상 받기 */
export const receiveQuestReward = (questId) =>
  apiRequest({
    endpoint: `/quests/${questId}/reward`,
    method: "POST"
  });
