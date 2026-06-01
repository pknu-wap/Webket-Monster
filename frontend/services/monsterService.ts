import { Storage } from "@plasmohq/storage";

const storage = new Storage();

export interface MonsterEvolution {
  levelThreshold: number;
  name: string;
  imageUrl: string;
  spritesheetUrl1?: string;
  spritesheetUrl2?: string;
  effectUrl?: string;
}

export interface Monster {
  id: string;
  name: string;
  imageUrl: string;
  spritesheetUrl1?: string;
  spritesheetUrl2?: string;
  effectUrl?: string;
  probability: number; // 0 to 1
  baseExpToNextLevel: number;
  evolutions?: MonsterEvolution[];
}

export interface CaughtMonster {
  id: string; // unique instance ID or could just be monsterId if 1 per type
  monsterId: string;
  level: number;
  exp: number;
  evolutionStage?: number; // 1 = Base, 2 = Lv3 Evo, 3 = Lv5 Evo
  hasPendingEffect?: boolean;
}

export interface UserInfo {
  userId?: number;
  nickname: string;
  totalCaught: number;
  activeMonsterId?: string | null;
  showActiveMonster?: boolean;
  spawnWildMonsters?: boolean;
}

export interface Inventory {
  caughtMonsters: CaughtMonster[];
  items?: {
    expPotions: number;
    evolutionStones: number;
  };
}

const S3_BUCKET_URL = "https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com";

// Mock Monster Data
const MOCK_MONSTERS: Monster[] = [
  // 1-3: 부경대
  {
    id: "1",
    name: "뿌공이",
    imageUrl: `${S3_BUCKET_URL}/1.png`,
    spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/1-1.png`,
    spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/1-2.png`,
    effectUrl: `${S3_BUCKET_URL}/effect/1`,
    probability: 0.3,
    baseExpToNextLevel: 10,
    evolutions: [
      {
        levelThreshold: 3,
        name: "백경이",
        imageUrl: `${S3_BUCKET_URL}/2.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/2-1.png`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/2-2.png`,
        effectUrl: `${S3_BUCKET_URL}/effect/2`
      },
      {
        levelThreshold: 5,
        name: "백경이와 뿌공이",
        imageUrl: `${S3_BUCKET_URL}/3.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/3-1.png`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/3-2.png`,
        effectUrl: `${S3_BUCKET_URL}/effect/3`
      }
    ]
  },
  // 4-6: 구글
  {
    id: "4",
    name: "구글링",
    imageUrl: `${S3_BUCKET_URL}/4.png`,
    spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/4-1.png`,
    spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/4-2.png`,
    effectUrl: `${S3_BUCKET_URL}/effect/4`,
    probability: 0.2,
    baseExpToNextLevel: 10,
    evolutions: [
      {
        levelThreshold: 3,
        name: "구글봇",
        imageUrl: `${S3_BUCKET_URL}/5.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/5-1.png`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/5-2.png`,
        effectUrl: `${S3_BUCKET_URL}/effect/5`
      },
      {
        levelThreshold: 5,
        name: "구글신",
        imageUrl: `${S3_BUCKET_URL}/6.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/6-1.png`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/6-2.png`,
        effectUrl: `${S3_BUCKET_URL}/effect/6`
      }
    ]
  },
  // 7-9: 네이버
  {
    id: "7",
    name: "초록창",
    imageUrl: `${S3_BUCKET_URL}/7.png`,
    spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/7-1.png`,
    spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/7-2.png`,
    effectUrl: `${S3_BUCKET_URL}/effect/7`,
    probability: 0.2,
    baseExpToNextLevel: 10,
    evolutions: [
      {
        levelThreshold: 3,
        name: "라인이",
        imageUrl: `${S3_BUCKET_URL}/8.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/8-1.png`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/8-2.png`,
        effectUrl: `${S3_BUCKET_URL}/effect/8`
      },
      {
        levelThreshold: 5,
        name: "하이퍼클로바",
        imageUrl: `${S3_BUCKET_URL}/9.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/9-1.png`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/9-2.png`,
        effectUrl: `${S3_BUCKET_URL}/effect/9`
      }
    ]
  },
  // 10-12: 유튜브
  {
    id: "10",
    name: "조회수",
    imageUrl: `${S3_BUCKET_URL}/10.png`,
    spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/10-1.png`,
    spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/10-2.png`,
    effectUrl: `${S3_BUCKET_URL}/effect/10`,
    probability: 0.15,
    baseExpToNextLevel: 10,
    evolutions: [
      {
        levelThreshold: 3,
        name: "크리에이터",
        imageUrl: `${S3_BUCKET_URL}/11.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/11-1.png`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/11-2.png`,
        effectUrl: `${S3_BUCKET_URL}/effect/11`
      },
      {
        levelThreshold: 5,
        name: "골드버튼",
        imageUrl: `${S3_BUCKET_URL}/12.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/12-1.png`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/12-2.png`,
        effectUrl: `${S3_BUCKET_URL}/effect/12`
      }
    ]
  },
  // 13-15: 깃허브
  {
    id: "13",
    name: "커밋",
    imageUrl: `${S3_BUCKET_URL}/13.png`,
    spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/13-1.png`,
    spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/13-2.png`,
    effectUrl: `${S3_BUCKET_URL}/effect/13`,
    probability: 0.15,
    baseExpToNextLevel: 10,
    evolutions: [
      {
        levelThreshold: 3,
        name: "옥토캣",
        imageUrl: `${S3_BUCKET_URL}/14.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/14-1.png`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/14-2.png`,
        effectUrl: `${S3_BUCKET_URL}/effect/14`
      },
      {
        levelThreshold: 5,
        name: "잔디밭",
        imageUrl: `${S3_BUCKET_URL}/15.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/15-1.png`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/15-2.png`,
        effectUrl: `${S3_BUCKET_URL}/effect/15`
      }
    ]
  },
  // 16-18: 링크드인
  {
    id: "16",
    name: "일촌신청",
    imageUrl: `${S3_BUCKET_URL}/16.png`,
    spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/16-1.png`,
    spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/16-2.png`,
    effectUrl: `${S3_BUCKET_URL}/effect/16`,
    probability: 0.1,
    baseExpToNextLevel: 10,
    evolutions: [
      {
        levelThreshold: 3,
        name: "프로직장러",
        imageUrl: `${S3_BUCKET_URL}/17.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/17-1.png`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/17-2.png`,
        effectUrl: `${S3_BUCKET_URL}/effect/17`
      },
      {
        levelThreshold: 5,
        name: "커리어킹",
        imageUrl: `${S3_BUCKET_URL}/18.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/18-1.png`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/18-2.png`,
        effectUrl: `${S3_BUCKET_URL}/effect/18`
      }
    ]
  },
  // 19-21: 나무위키
  {
    id: "19",
    name: "작은나무",
    imageUrl: `${S3_BUCKET_URL}/19.png`,
    spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/19-1.png`,
    spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/19-2.png`,
    effectUrl: `${S3_BUCKET_URL}/effect/19`,
    probability: 0.1,
    baseExpToNextLevel: 10,
    evolutions: [
      {
        levelThreshold: 3,
        name: "기여분",
        imageUrl: `${S3_BUCKET_URL}/20.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/20-1.png`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/20-2.png`,
        effectUrl: `${S3_BUCKET_URL}/effect/20`
      },
      {
        levelThreshold: 5,
        name: "나무위키",
        imageUrl: `${S3_BUCKET_URL}/21.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/21-1.png`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/21-2.png`,
        effectUrl: `${S3_BUCKET_URL}/effect/21`
      }
    ]
  },
  // 22-24: chatgpt
  {
    id: "22",
    name: "프롬프트",
    imageUrl: `${S3_BUCKET_URL}/22.png`,
    spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/22-1.png`,
    spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/22-2.png`,
    effectUrl: `${S3_BUCKET_URL}/effect/22`,
    probability: 0.05,
    baseExpToNextLevel: 10,
    evolutions: [
      {
        levelThreshold: 3,
        name: "GPT-4",
        imageUrl: `${S3_BUCKET_URL}/23.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/23-1.png`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/23-2.png`,
        effectUrl: `${S3_BUCKET_URL}/effect/23`
      },
      {
        levelThreshold: 5,
        name: "초지능",
        imageUrl: `${S3_BUCKET_URL}/24.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/24-1.png`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/24-2.png`,
        effectUrl: `${S3_BUCKET_URL}/effect/24`
      }
    ]
  }
];

export interface EvolvedMonsterData {
  name: string;
  imageUrl: string;
  spritesheetUrl1?: string;
  spritesheetUrl2?: string;
  effectUrl?: string;
}

export function getEvolvedMonsterData(monster: Monster, evolutionStage: number = 1): EvolvedMonsterData {
  let currentName = monster.name;
  let currentImage = monster.imageUrl;
  let currentSpritesheet1 = monster.spritesheetUrl1;
  let currentSpritesheet2 = monster.spritesheetUrl2;
  let currentEffect = monster.effectUrl;

  if (monster.evolutions && evolutionStage > 1) {
    const targetThreshold = evolutionStage === 2 ? 3 : 5;
    const evo = monster.evolutions.find(e => e.levelThreshold === targetThreshold);
    if (evo) {
      currentName = evo.name;
      currentImage = evo.imageUrl;
      currentSpritesheet1 = evo.spritesheetUrl1 || currentSpritesheet1;
      currentSpritesheet2 = evo.spritesheetUrl2 || currentSpritesheet2;
      currentEffect = evo.effectUrl || currentEffect;
    }
  }

  return { 
    name: currentName, 
    imageUrl: currentImage,
    spritesheetUrl1: currentSpritesheet1,
    spritesheetUrl2: currentSpritesheet2,
    effectUrl: currentEffect
  };
}

export function getRequiredExpForLevel(level: number): number {
  return 100 * (level * level);
}

export interface IMonsterService {
  getUserInfo(): Promise<UserInfo>;
  getMonsterList(): Promise<Monster[]>;
  getInventory(): Promise<Inventory>;
  catchMonster(monsterId: string): Promise<{ success: boolean; newLevel?: number; message: string }>;
  setActiveMonster(caughtMonsterId: string | null): Promise<void>;
  toggleActiveMonsterDisplay(show: boolean): Promise<void>;
  toggleWildMonsterSpawn(show: boolean): Promise<void>;
  useExpPotion(caughtMonsterId: string): Promise<{ success: boolean; newLevel?: number; message: string }>;
  evolveMonster(caughtMonsterId: string): Promise<{ success: boolean; newStage?: number; message: string }>;
  addItems(potions: number, stones: number): Promise<Inventory>;
  isActiveMonsterHungry(): Promise<boolean>;
  feedActiveMonster(): Promise<{ success: boolean; newLevel: number; triggerAction2: boolean; message: string }>;
  castEffect(caughtMonsterId: string): Promise<{ success: boolean; message: string }>;
  clearEffect(caughtMonsterId: string): Promise<void>;
}

export class BackendMonsterService implements IMonsterService {
  async getUserInfo(): Promise<UserInfo> {
    let userInfo = await storage.get<UserInfo>("userInfo");
    if (!userInfo) {
      userInfo = { nickname: "Tamer", totalCaught: 0, activeMonsterId: null };
    }

    if (!userInfo.userId) {
      try {
        const res = await fetch(`${process.env.PLASMO_PUBLIC_API_URL || "http://localhost:8080/api"}/auth/anonymous`, {
          method: "POST"
        });
        if (res.ok) {
          const data = await res.json();
          userInfo.userId = data.user.id;
          if (data.user.id) {
            userInfo.nickname = "Trainer_" + (data.user.id % 10000);
          }
        } else {
          userInfo.userId = 1;
        }
      } catch (e) {
        console.warn("Backend server is offline. Falling back to local offline mode:", e);
        userInfo.userId = 1;
      }
      await storage.set("userInfo", userInfo);
    }
    return userInfo;
  }

  async setActiveMonster(caughtMonsterId: string | null): Promise<void> {
    const userInfo = await this.getUserInfo();
    userInfo.activeMonsterId = caughtMonsterId;
    await storage.set("userInfo", userInfo);

    if (caughtMonsterId) {
      try {
        const { questService } = await import("./questService");
        await questService.incrementProgress("active", 1);
      } catch (e) {
        console.error("Failed to update active quest progress:", e);
      }
    }
  }

  async toggleActiveMonsterDisplay(show: boolean): Promise<void> {
    const userInfo = await this.getUserInfo();
    userInfo.showActiveMonster = show;
    await storage.set("userInfo", userInfo);
  }

  async toggleWildMonsterSpawn(show: boolean): Promise<void> {
    const userInfo = await this.getUserInfo();
    userInfo.spawnWildMonsters = show;
    await storage.set("userInfo", userInfo);
  }

  async getMonsterList(): Promise<Monster[]> {
    return MOCK_MONSTERS;
  }

  async getInventory(): Promise<Inventory> {
    let caughtMonsters: CaughtMonster[] = [];

    // Attempt to load from backend
    try {
       const userInfo = await this.getUserInfo();
       const userId = userInfo.userId || 1;
       const res = await fetch(`${process.env.PLASMO_PUBLIC_API_URL || "http://localhost:8080/api"}/user-monsters/user/${userId}`, {
          headers: {
             "X-User-Id": userId.toString()
          }
       });
       if (res.ok) {
         const data = await res.json();
         caughtMonsters = data.map((item: any) => ({
            id: item.userMonsterId.toString(),
            monsterId: item.monsterId.toString(),
            level: item.level,
            exp: item.exp,
            evolutionStage: item.evolutionStage || 1,
            hasPendingEffect: item.hasPendingEffect
         }));
       }
    } catch (e) {
       console.warn("Backend inventory fetch offline, using local fallback:", e);
    }

    // If backend failed/empty, load caught monsters from local storage fallback
    if (caughtMonsters.length === 0) {
      const storedInv = await storage.get<Inventory>("inventory");
      if (storedInv && storedInv.caughtMonsters) {
        caughtMonsters = storedInv.caughtMonsters;
      }
    }

    // Load items from backend
    let items = { expPotions: 0, evolutionStones: 0 };
    try {
       const userInfo = await this.getUserInfo();
       const userId = userInfo.userId || 1;
       const res = await fetch(`${process.env.PLASMO_PUBLIC_API_URL || "http://localhost:8080/api"}/users/${userId}/inventory`, {
          headers: {
             "X-User-Id": userId.toString()
          }
       });
       if (res.ok) {
         const data = await res.json();
         items = {
           expPotions: data.expPotions,
           evolutionStones: data.evolutionStones
         };
       } else {
         throw new Error("Backend response error");
       }
    } catch (e) {
       console.warn("Backend items fetch offline, using local fallback:", e);
       const storedInv = await storage.get<Inventory>("inventory");
       if (storedInv && storedInv.items) {
         items = storedInv.items;
       } else {
         items = { expPotions: 5, evolutionStones: 2 };
       }
    }

    const inventory: Inventory = { caughtMonsters, items };
    await storage.set("inventory", inventory);
    return inventory;
  }

  async catchMonster(monsterId: string): Promise<{ success: boolean; newLevel?: number; message: string }> {
    const userInfo = await this.getUserInfo();
    const userId = userInfo.userId || 1;
    const monsterData = MOCK_MONSTERS.find(m => m.id === monsterId);

    if (!monsterData) {
      return { success: false, message: "Monster not found." };
    }

    let newLevel = undefined;
    let message = `You caught a ${monsterData.name}!`;

    try {
      const parsedMonsterId = parseInt(monsterId.replace(/[^0-9]/g, "")) || 1;
      const res = await fetch(`${process.env.PLASMO_PUBLIC_API_URL || "http://localhost:8080/api"}/monsters/catch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId.toString()
        },
        body: JSON.stringify({ monsterId: parsedMonsterId })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.isDuplicate) {
          message = `야생 ${monsterData.name} 포획 성공! EXP가 증가했습니다.`;
          if (data.currentMonster && data.currentMonster.level > 1) {
            // Check if leveled up by comparing local data
            const localInv = await storage.get<any>("inventory");
            const localCm = localInv?.caughtMonsters?.find((m: any) => m.monsterId === monsterId);
            if (localCm && data.currentMonster.level > localCm.level) {
              newLevel = data.currentMonster.level;
              message = `${monsterData.name}(이)가 레벨업하여 Lv.${newLevel}(이)가 되었습니다!`;
            }
          }
        } else {
          message = `도감 등록 완료! 새로운 몬스터 ${monsterData.name}를 포획했습니다!`;
        }
      }
    } catch (e) {
      console.error("Backend catch API failed, using local fallback:", e);
      // Offline fallback: use local state
      const inventory = await this.getInventory();
      const existingMonster = inventory.caughtMonsters.find(m => m.monsterId === monsterId);
      if (!existingMonster) {
        inventory.caughtMonsters.push({
          id: `cm_${Date.now()}`,
          monsterId: monsterId,
          level: 1,
          exp: 0,
          evolutionStage: 1
        });
        message = `도감 등록 완료! 새로운 몬스터 ${monsterData.name}를 포획했습니다! (오프라인)`;
        await storage.set("inventory", inventory);
      } else {
        message = `야생 ${monsterData.name} 포획 성공! (오프라인 모드)`;
      }
    }

    // Update user info totalCaught
    userInfo.totalCaught += 1;
    await storage.set("userInfo", userInfo);

    // Refresh inventory from backend to get correct DB IDs
    await this.getInventory();

    // Sync with achievements and daily quests
    try {
      const { questService } = await import("./questService");
      await questService.incrementProgress("catch", 1);
      await questService.syncAchievements();
    } catch (e) {
      console.error("Failed to sync quests on catch:", e);
    }

    return { success: true, newLevel, message };
  }

  async useExpPotion(caughtMonsterId: string): Promise<{ success: boolean; newLevel?: number; message: string }> {
    const userInfo = await this.getUserInfo();
    const userId = userInfo.userId || 1;

    try {
       const res = await fetch(`${process.env.PLASMO_PUBLIC_API_URL || "http://localhost:8080/api"}/user-monsters/${caughtMonsterId}/levelup`, {
          method: "POST",
          headers: {
             "X-User-Id": userId.toString()
          }
       });

       if (!res.ok) {
          const errorData = await res.text();
          return { success: false, message: errorData || "물약 사용 실패" };
       }

       const data = await res.json();
       
       // Sync inventory immediately to refresh UI
       await this.getInventory();

       const monsters = await this.getMonsterList();
       // caughtMonsterId here is the userMonsterId (DB instance ID), find monster by monsterId
       const inventory = await storage.get<Inventory>("inventory");
       const cm = inventory?.caughtMonsters?.find((m: any) => m.id === caughtMonsterId);
       const monsterData = cm ? monsters.find(m => m.id === cm.monsterId) : null;
       const name = monsterData?.name || "몬스터";

       // Backend DTO field: currentLevel (not data.level)
       let msg = `EXP 물약을 사용했습니다! (+100 EXP) 🧪`;
       if (data.currentLevel) {
          msg = `${name}(이)가 레벨업하여 Lv.${data.currentLevel}(이)가 되었습니다! 🎉`;
       }

       // Sync achievements
       try {
         const { questService } = await import("./questService");
         await questService.syncAchievements();
       } catch (e) {
         console.error("Failed to sync achievements after potion use:", e);
       }

       return { success: true, newLevel: data.currentLevel, message: msg };
    } catch (e) {
       console.error("Backend useExpPotion failed:", e);
       return { success: false, message: "백엔드 연결에 실패했습니다." };
    }
  }

  async evolveMonster(caughtMonsterId: string): Promise<{ success: boolean; newStage?: number; message: string }> {
    const userInfo = await this.getUserInfo();
    const userId = userInfo.userId || 1;

    try {
       const res = await fetch(`${process.env.PLASMO_PUBLIC_API_URL || "http://localhost:8080/api"}/user-monsters/${caughtMonsterId}/evolve`, {
          method: "PATCH",
          headers: {
             "X-User-Id": userId.toString()
          }
       });

       if (!res.ok) {
          const errorData = await res.text();
          return { success: false, message: errorData || "진화 실패" };
       }

       const data = await res.json();
       
       // Sync inventory immediately to refresh UI
       await this.getInventory();

       const nextId = parseInt(data.nextMonsterId.toString()) || 1;
       const newStage = ((nextId - 1) % 3) + 1;

       // Sync achievements
       try {
         const { questService } = await import("./questService");
         await questService.syncAchievements();
       } catch (e) {
         console.error("Failed to sync achievements after evolution:", e);
       }

       return {
          success: true,
          newStage: newStage,
          message: `축하합니다! ${data.nextMonsterName}(으)로 성공적으로 진화했습니다! 🎉💎`
       };
    } catch (e) {
       console.error("Backend evolveMonster failed:", e);
       return { success: false, message: "백엔드 연결에 실패했습니다." };
    }
  }

  async addItems(potions: number, stones: number): Promise<Inventory> {
    // Inventory is synchronized via backend calls. We just pull latest state.
    return await this.getInventory();
  }

  async isActiveMonsterHungry(): Promise<boolean> {
    const userInfo = await this.getUserInfo();
    if (!userInfo.activeMonsterId) return false;

    const inventory = await this.getInventory();
    const cm = inventory.caughtMonsters.find(m => m.id === userInfo.activeMonsterId);
    if (!cm) return false;

    // 30 minutes in ms: 30 * 60 * 1000 = 1800000 ms
    const HUNGER_THRESHOLD = 30 * 60 * 1000;
    const lastFed = cm.lastFedTime || 0;
    return Date.now() - lastFed >= HUNGER_THRESHOLD;
  }

  async feedActiveMonster(): Promise<{ success: boolean; newLevel: number; triggerAction2: boolean; message: string }> {
    const userInfo = await this.getUserInfo();
    const userId = userInfo.userId || 1;

    if (!userInfo.activeMonsterId) {
      return { success: false, newLevel: 1, triggerAction2: false, message: "장착된 활성화 몬스터가 없습니다." };
    }

    const inventory = await this.getInventory();
    const cm = inventory.caughtMonsters.find(m => m.id === userInfo.activeMonsterId);
    if (!cm) {
      return { success: false, newLevel: 1, triggerAction2: false, message: "몬스터를 찾을 수 없습니다." };
    }

    const isHungry = await this.isActiveMonsterHungry();
    if (!isHungry) {
      return { success: false, newLevel: cm.level, triggerAction2: false, message: "몬스터가 아직 배고프지 않습니다." };
    }

    const monsters = await this.getMonsterList();
    const monsterData = monsters.find(m => m.id === cm.monsterId);
    if (!monsterData) {
      return { success: false, newLevel: cm.level, triggerAction2: false, message: "몬스터 메타데이터를 찾을 수 없습니다." };
    }

    // Feeding logic: lastFedTime = Date.now(), exp += 2
    cm.lastFedTime = Date.now();
    cm.exp += 2;

    let newLevel = cm.level;
    let leveledUp = false;

    while (cm.level < 5) {
      const requiredExp = getRequiredExpForLevel(cm.level);
      if (cm.exp >= requiredExp) {
        cm.exp -= requiredExp;
        cm.level += 1;
        newLevel = cm.level;
        leveledUp = true;
      } else {
        break;
      }
    }

    if (cm.level >= 5) {
      cm.exp = 0; // Cap EXP at Max Level
    }

    // Track total feeds globally/individually for Quest
    let totalFeeds = await storage.get<number>("totalFeeds") || 0;
    totalFeeds += 1;
    await storage.set("totalFeeds", totalFeeds);

    // Save inventory
    await storage.set("inventory", inventory);

    // Sync with backend (Post feeding activity)
    let triggerAction2 = totalFeeds % 10 === 0;
    try {
       const res = await fetch(`${process.env.PLASMO_PUBLIC_API_URL || "http://localhost:8080/api"}/users/${userId}/sync-activity`, {
          method: "POST",
          headers: {
             "Content-Type": "application/json",
             "X-User-Id": userId.toString()
          },
          body: JSON.stringify({
             feedIncrement: 1
          })
       });
       if (res.ok) {
          const data = await res.json();
          triggerAction2 = data.triggerAction2;
       }
    } catch (e) {
       console.error("Failed to sync feeding activity to backend:", e);
    }

    // Sync with achievements and daily quests
    try {
      const { questService } = await import("./questService");
      await questService.syncAchievements();
    } catch (e) {
      console.error("Failed to sync quests on feed:", e);
    }

    let message = `몬스터에게 먹이를 주었습니다! 경험치 +2 올랐습니다.`;
    if (leveledUp) {
      message += ` 레벨업하여 Lv.${newLevel}이 되었습니다! 🎉`;
    }

    return {
      success: true,
      newLevel,
      triggerAction2,
      message
    };
  }

  async castEffect(caughtMonsterId: string): Promise<{ success: boolean; message: string }> {
    const userInfo = await this.getUserInfo();
    const userId = userInfo.userId || 1;
    let cleanId = caughtMonsterId;
    if (caughtMonsterId.startsWith("cm_")) {
      cleanId = caughtMonsterId.replace("cm_", "");
    }
    let parsedId = parseInt(cleanId);
    if (isNaN(parsedId)) {
      parsedId = 1;
    }
    try {
       const res = await fetch(`${process.env.PLASMO_PUBLIC_API_URL || "http://localhost:8080/api"}/user-monsters/${parsedId}/effect`, {
          method: "POST",
          headers: {
             "X-User-Id": userId.toString()
          }
       });
       if (res.ok) {
          const data = await res.json();
          return { success: true, message: data.effectResult || "이펙트 시전 성공!" };
       } else {
          return { success: false, message: "이펙트 시전 실패" };
       }
    } catch (e) {
       console.error("Backend castEffect failed:", e);
       return { success: false, message: "백엔드 연결에 실패했습니다." };
    }
  }

  async clearEffect(caughtMonsterId: string): Promise<void> {
    const userInfo = await this.getUserInfo();
    const userId = userInfo.userId || 1;
    let cleanId = caughtMonsterId;
    if (caughtMonsterId.startsWith("cm_")) {
      cleanId = caughtMonsterId.replace("cm_", "");
    }
    let parsedId = parseInt(cleanId);
    if (isNaN(parsedId)) {
      parsedId = 1;
    }
    try {
       await fetch(`${process.env.PLASMO_PUBLIC_API_URL || "http://localhost:8080/api"}/user-monsters/${parsedId}/effect/clear`, {
          method: "POST",
          headers: {
             "X-User-Id": userId.toString()
          }
       });
    } catch (e) {
       console.error("Backend clearEffect failed:", e);
    }
  }
}

export const monsterService: IMonsterService = new BackendMonsterService();

