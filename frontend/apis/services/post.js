export const normalizeUser = (response) => ({
  id: response?.id ?? response?.user?.id ?? null,
  email: response?.email ?? response?.user?.email ?? "",
  nickname: response?.nickname ?? "",
  accessToken: response?.accessToken ?? null,
  monsters: response?.monsters ?? [],
  items: response?.items ?? []
});

export const normalizeItem = (response) => ({
  itemId: response?.itemId ?? response?.id ?? null,
  name: response?.name ?? "",
  effectType: response?.effectType ?? null,
  value: response?.value ?? 0
});

export const normalizeMonster = (response) => ({
  userMonsterId: response?.userMonsterId ?? response?.id ?? null,
  monsterId: response?.monsterId ?? null,
  name: response?.name ?? "",
  type: response?.type ?? "",
  characteristics: response?.characteristics ?? "",
  level: response?.level ?? response?.baseLevel ?? 1,
  exp: response?.exp ?? 0,
  requiredExpForNextLevel: response?.requiredExpForNextLevel ?? 0,
  evolutionInfo: response?.evolutionInfo ?? "",
  imageUrl: response?.imageUrl ?? ""
});

export const normalizeMonsterList = (response) =>
  Array.isArray(response) ? response.map(normalizeMonster) : [];

export const normalizeCatchResult = (response) => ({
  message: response?.message ?? "",
  isDuplicate: Boolean(response?.isDuplicate),
  addedExp: response?.addedExp ?? 0,
  currentMonster: response?.currentMonster
    ? {
        id: response.currentMonster.id ?? null,
        level: response.currentMonster.level ?? 1,
        exp: response.currentMonster.exp ?? 0
      }
    : null
});

export const normalizeQuest = (response) => ({
  questId: response?.questId ?? response?.id ?? null,
  title: response?.title ?? response?.name ?? "",
  description: response?.description ?? "",
  status: response?.status ?? "",
  reward: response?.reward ?? null
});

export const normalizeQuestList = (response) =>
  Array.isArray(response) ? response.map(normalizeQuest) : [];
