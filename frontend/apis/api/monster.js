import { DEFAULT_USER_ID } from "../config/constants";
import { apiRequest } from "../utils/http";

export const MONSTER_API_SPECS = {
  getMonsterList: {
    title: "몬스터 목록 조회",
    method: "GET",
    endpoint: "/monsters",
    serverReady: true
  },
  spawnMonster: {
    title: "몬스터 생성(페이지 이동)",
    method: "POST",
    endpoint: "/monsters/spawn",
    serverReady: true
  },
  catchMonster: {
    title: "몬스터 잡기(내 몬스터 목록에 생성)",
    method: "POST",
    endpoint: "/monsters/catch",
    serverReady: true
  },
  getUserMonsterInfo: {
    title: "몬스터 정보 보기",
    method: "GET",
    endpoint: "/user-monsters/{userMonsterId}",
    serverReady: true
  },
  getMyMonsters: {
    title: "내 몬스터 목록 조회",
    method: "GET",
    endpoint: "/user-monsters/user/{userId}",
    serverReady: true
  },
  levelUpMonster: {
    title: "몬스터 레벨업",
    method: "POST",
    endpoint: "/user-monsters/{userMonsterId}/levelup",
    serverReady: true
  },
  triggerMonsterAction: {
    title: "몬스터 액션 발동",
    method: "POST",
    endpoint: "/user-monsters/{userMonsterId}/action",
    serverReady: true
  },
  triggerMonsterEffect: {
    title: "몬스터 이펙트 발동",
    method: "POST",
    endpoint: "/user-monsters/{userMonsterId}/effect",
    serverReady: true
  },
  evolveMonster: {
    title: "몬스터 진화",
    method: "PATCH",
    endpoint: "/user-monsters/{userMonsterId}/evolve",
    serverReady: true
  },
  feedMonster: {
    title: "몬스터 먹이주기",
    method: "POST",
    endpoint: "/user-monsters/{userMonsterId}/feed",
    serverReady: true
  }
};

/** 몬스터 목록 조회 */
export const getMonsterList = () =>
  apiRequest({
    endpoint: MONSTER_API_SPECS.getMonsterList.endpoint
  });

/** 몬스터 생성(페이지 이동) */
export const spawnMonster = () =>
  apiRequest({
    endpoint: MONSTER_API_SPECS.spawnMonster.endpoint,
    method: "POST"
  });

/** 몬스터 잡기(내 몬스터 목록에 생성) */
export const catchMonster = (monsterId) =>
  apiRequest({
    endpoint: MONSTER_API_SPECS.catchMonster.endpoint,
    method: "POST",
    body: { monsterId }
  });

/** 몬스터 정보 보기 */
export const getUserMonsterInfo = (userMonsterId) =>
  apiRequest({
    endpoint: `/user-monsters/${userMonsterId}`
  });

/** 내 몬스터 목록 조회 */
export const getMyMonsters = (userId = DEFAULT_USER_ID) =>
  apiRequest({
    endpoint: `/user-monsters/user/${userId}`
  });

/** 몬스터 레벨업 */
export const levelUpMonster = (userMonsterId) =>
  apiRequest({
    endpoint: `/user-monsters/${userMonsterId}/levelup`,
    method: "POST"
  });

/** 몬스터 액션 발동 */
export const triggerMonsterAction = (userMonsterId) =>
  apiRequest({
    endpoint: `/user-monsters/${userMonsterId}/action`,
    method: "POST"
  });

/** 몬스터 이펙트 발동 */
export const triggerMonsterEffect = (userMonsterId) =>
  apiRequest({
    endpoint: `/user-monsters/${userMonsterId}/effect`,
    method: "POST"
  });

/** 몬스터 진화 */
export const evolveMonster = (userMonsterId) =>
  apiRequest({
    endpoint: `/user-monsters/${userMonsterId}/evolve`,
    method: "PATCH"
  });

/** 몬스터 먹이주기 */
export const feedMonster = (userMonsterId) =>
  apiRequest({
    endpoint: `/user-monsters/${userMonsterId}/feed`,
    method: "POST"
  });
