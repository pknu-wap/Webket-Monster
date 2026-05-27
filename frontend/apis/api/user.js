import { apiRequest } from "../utils/http";

export const USER_API_SPECS = {
  loginWithGoogle: {
    title: "구글 로그인",
    method: "POST",
    endpoint: "/auth/login",
    serverReady: true
  },
  getMyInfo: {
    title: "내 정보 조회",
    method: "GET",
    endpoint: "/users/me",
    serverReady: true
  },
  changeActiveMonster: {
    title: "몬스터 바꾸기",
    method: "PATCH",
    endpoint: "/users/me/active-monster",
    serverReady: true
  }
};

/** 구글 로그인 */
export const loginWithGoogle = (idToken) =>
  apiRequest({
    endpoint: USER_API_SPECS.loginWithGoogle.endpoint,
    method: "POST",
    body: { idToken }
  });

/** 내 정보 조회 */
export const getMyInfo = () =>
  apiRequest({
    endpoint: USER_API_SPECS.getMyInfo.endpoint
  });

/** 몬스터 바꾸기 */
export const changeActiveMonster = (userMonsterId) =>
  apiRequest({
    endpoint: USER_API_SPECS.changeActiveMonster.endpoint,
    method: "PATCH",
    body: { userMonsterId }
  });
