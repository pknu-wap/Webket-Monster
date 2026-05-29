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
    spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/1-1`,
    spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/1-2`,
    effectUrl: `${S3_BUCKET_URL}/effect/1`,
    probability: 0.3,
    baseExpToNextLevel: 10,
    evolutions: [
      {
        levelThreshold: 3,
        name: "백경이",
        imageUrl: `${S3_BUCKET_URL}/2.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/2-1`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/2-2`,
        effectUrl: `${S3_BUCKET_URL}/effect/2`
      },
      {
        levelThreshold: 5,
        name: "백경이와 뿌공이",
        imageUrl: `${S3_BUCKET_URL}/3.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/3-1`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/3-2`,
        effectUrl: `${S3_BUCKET_URL}/effect/3`
      }
    ]
  },
  // 4-6: 구글
  {
    id: "4",
    name: "구글링",
    imageUrl: `${S3_BUCKET_URL}/4.png`,
    spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/4-1`,
    spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/4-2`,
    effectUrl: `${S3_BUCKET_URL}/effect/4`,
    probability: 0.2,
    baseExpToNextLevel: 10,
    evolutions: [
      {
        levelThreshold: 3,
        name: "구글봇",
        imageUrl: `${S3_BUCKET_URL}/5.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/5-1`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/5-2`,
        effectUrl: `${S3_BUCKET_URL}/effect/5`
      },
      {
        levelThreshold: 5,
        name: "구글신",
        imageUrl: `${S3_BUCKET_URL}/6.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/6-1`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/6-2`,
        effectUrl: `${S3_BUCKET_URL}/effect/6`
      }
    ]
  },
  // 7-9: 네이버
  {
    id: "7",
    name: "초록창",
    imageUrl: `${S3_BUCKET_URL}/7.png`,
    spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/7-1`,
    spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/7-2`,
    effectUrl: `${S3_BUCKET_URL}/effect/7`,
    probability: 0.2,
    baseExpToNextLevel: 10,
    evolutions: [
      {
        levelThreshold: 3,
        name: "라인이",
        imageUrl: `${S3_BUCKET_URL}/8.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/8-1`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/8-2`,
        effectUrl: `${S3_BUCKET_URL}/effect/8`
      },
      {
        levelThreshold: 5,
        name: "하이퍼클로바",
        imageUrl: `${S3_BUCKET_URL}/9.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/9-1`,
        spritesheetUrl2: `${S3_BUCKET_URL}/9-2`,
        effectUrl: `${S3_BUCKET_URL}/effect/9`
      }
    ]
  },
  // 10-12: 유튜브
  {
    id: "10",
    name: "조회수",
    imageUrl: `${S3_BUCKET_URL}/10.png`,
    spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/10-1`,
    spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/10-2`,
    effectUrl: `${S3_BUCKET_URL}/effect/10`,
    probability: 0.15,
    baseExpToNextLevel: 10,
    evolutions: [
      {
        levelThreshold: 3,
        name: "크리에이터",
        imageUrl: `${S3_BUCKET_URL}/11.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/11-1`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/11-2`,
        effectUrl: `${S3_BUCKET_URL}/effect/11`
      },
      {
        levelThreshold: 5,
        name: "골드버튼",
        imageUrl: `${S3_BUCKET_URL}/12.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/12-1`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/12-2`,
        effectUrl: `${S3_BUCKET_URL}/effect/12`
      }
    ]
  },
  // 13-15: 깃허브
  {
    id: "13",
    name: "커밋",
    imageUrl: `${S3_BUCKET_URL}/13.png`,
    spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/13-1`,
    spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/13-2`,
    effectUrl: `${S3_BUCKET_URL}/effect/13`,
    probability: 0.15,
    baseExpToNextLevel: 10,
    evolutions: [
      {
        levelThreshold: 3,
        name: "옥토캣",
        imageUrl: `${S3_BUCKET_URL}/14.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/14-1`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/14-2`,
        effectUrl: `${S3_BUCKET_URL}/effect/14`
      },
      {
        levelThreshold: 5,
        name: "잔디밭",
        imageUrl: `${S3_BUCKET_URL}/15.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/15-1`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/15-2`,
        effectUrl: `${S3_BUCKET_URL}/effect/15`
      }
    ]
  },
  // 16-18: 링크드인
  {
    id: "16",
    name: "일촌신청",
    imageUrl: `${S3_BUCKET_URL}/16.png`,
    spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/16-1`,
    spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/16-2`,
    effectUrl: `${S3_BUCKET_URL}/effect/16`,
    probability: 0.1,
    baseExpToNextLevel: 10,
    evolutions: [
      {
        levelThreshold: 3,
        name: "프로직장러",
        imageUrl: `${S3_BUCKET_URL}/17.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/17-1`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/17-2`,
        effectUrl: `${S3_BUCKET_URL}/effect/17`
      },
      {
        levelThreshold: 5,
        name: "커리어킹",
        imageUrl: `${S3_BUCKET_URL}/18.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/18-1`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/18-2`,
        effectUrl: `${S3_BUCKET_URL}/effect/18`
      }
    ]
  },
  // 19-21: 나무위키
  {
    id: "19",
    name: "작은나무",
    imageUrl: `${S3_BUCKET_URL}/19.png`,
    spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/19-1`,
    spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/19-2`,
    effectUrl: `${S3_BUCKET_URL}/effect/19`,
    probability: 0.1,
    baseExpToNextLevel: 10,
    evolutions: [
      {
        levelThreshold: 3,
        name: "기여분",
        imageUrl: `${S3_BUCKET_URL}/20.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/20-1`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/20-2`,
        effectUrl: `${S3_BUCKET_URL}/effect/20`
      },
      {
        levelThreshold: 5,
        name: "나무위키",
        imageUrl: `${S3_BUCKET_URL}/21.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/21-1`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/21-2`,
        effectUrl: `${S3_BUCKET_URL}/effect/21`
      }
    ]
  },
  // 22-24: chatgpt
  {
    id: "22",
    name: "프롬프트",
    imageUrl: `${S3_BUCKET_URL}/22.png`,
    spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/22-1`,
    spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/22-2`,
    effectUrl: `${S3_BUCKET_URL}/effect/22`,
    probability: 0.05,
    baseExpToNextLevel: 10,
    evolutions: [
      {
        levelThreshold: 3,
        name: "GPT-4",
        imageUrl: `${S3_BUCKET_URL}/23.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/23-1`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/23-2`,
        effectUrl: `${S3_BUCKET_URL}/effect/23`
      },
      {
        levelThreshold: 5,
        name: "초지능",
        imageUrl: `${S3_BUCKET_URL}/24.png`,
        spritesheetUrl1: `${S3_BUCKET_URL}/spritesheet/24-1`,
        spritesheetUrl2: `${S3_BUCKET_URL}/spritesheet/24-2`,
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
        console.error("Failed to register anonymous user with backend:", e);
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
            evolutionStage: item.evolutionStage || 1
         }));
       }
    } catch (e) {
       console.error("Failed to fetch inventory from backend:", e);
    }

    // If backend failed/empty, load caught monsters from local storage fallback
    if (caughtMonsters.length === 0) {
      const storedInv = await storage.get<Inventory>("inventory");
      if (storedInv && storedInv.caughtMonsters) {
        caughtMonsters = storedInv.caughtMonsters;
      }
    }

    // Load items from local storage
    const storedInv = await storage.get<Inventory>("inventory");
    let items = storedInv?.items;
    if (!items) {
      // Default initial items for testing
      items = { expPotions: 5, evolutionStones: 2 };
    }

    const inventory: Inventory = { caughtMonsters, items };
    await storage.set("inventory", inventory);
    return inventory;
  }

  async catchMonster(monsterId: string): Promise<{ success: boolean; newLevel?: number; message: string }> {
    const inventory = await this.getInventory();
    const userInfo = await this.getUserInfo();
    const monsterData = MOCK_MONSTERS.find(m => m.id === monsterId);

    if (!monsterData) {
      return { success: false, message: "Monster not found." };
    }

    const existingMonster = inventory.caughtMonsters.find(m => m.monsterId === monsterId);

    let newLevel = undefined;
    let message = `You caught a ${monsterData.name}!`;

    if (existingMonster) {
      // Logic: Same monster caught -> exp up, level up (Max Lv.5)
      if (existingMonster.level < 5) {
        existingMonster.exp += 5; // Fixed exp per catch
        
        while (existingMonster.level < 5) {
          const requiredExp = monsterData.baseExpToNextLevel * existingMonster.level;
          if (existingMonster.exp >= requiredExp) {
            existingMonster.exp -= requiredExp;
            existingMonster.level += 1;
            newLevel = existingMonster.level;
            message = `${monsterData.name}(이)가 레벨업하여 Lv.${newLevel}(이)가 되었습니다!`;
            
            // Connect to backend: call level up API
            try {
               const userId = userInfo.userId || 1;
               await fetch(`${process.env.PLASMO_PUBLIC_API_URL || "http://localhost:8080/api"}/user-monsters/${existingMonster.id}/levelup`, {
                  method: "POST",
                  headers: {
                     "X-User-Id": userId.toString()
                  }
               });
            } catch (e) {
               console.error("Backend connection failed:", e);
            }
          } else {
            break;
          }
        }

        if (existingMonster.level >= 5) {
          existingMonster.exp = 0; // Cap EXP at Max Level
        }

        if (!newLevel) {
          message = `야생 ${monsterData.name} 포획 성공! EXP가 5 증가했습니다.`;
        }
      } else {
        message = `야생 ${monsterData.name} 포획 성공! 이미 최대 레벨(Lv.5)입니다.`;
      }
    } else {
      // New monster
      inventory.caughtMonsters.push({
        id: `cm_${Date.now()}`,
        monsterId: monsterId,
        level: 1,
        exp: 0,
        evolutionStage: 1
      });
      message = `도감 등록 완료! 새로운 몬스터 ${monsterData.name}를 포획했습니다!`;
      
      // Connect to backend: call catch API
      try {
         const userId = userInfo.userId || 1;
         const parsedMonsterId = parseInt(monsterId.replace(/[^0-9]/g, "")) || 1;
         await fetch(`${process.env.PLASMO_PUBLIC_API_URL || "http://localhost:8080/api"}/monsters/catch`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "X-User-Id": userId.toString()
            },
            body: JSON.stringify({ monsterId: parsedMonsterId })
         });
      } catch (e) {
         console.error("Backend connection failed:", e);
      }
    }

    // Update user info
    userInfo.totalCaught += 1;

    // Save to storage
    await storage.set("inventory", inventory);
    await storage.set("userInfo", userInfo);

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
    const inventory = await this.getInventory();
    const items = inventory.items || { expPotions: 0, evolutionStones: 0 };

    if (items.expPotions <= 0) {
      return { success: false, message: "사용할 수 있는 EXP 물약이 없습니다!" };
    }

    const cm = inventory.caughtMonsters.find(m => m.id === caughtMonsterId);
    if (!cm) {
      return { success: false, message: "몬스터를 찾을 수 없습니다." };
    }

    if (cm.level >= 5) {
      return { success: false, message: "이미 최대 레벨(Lv.5)입니다!" };
    }

    const monsters = await this.getMonsterList();
    const monsterData = monsters.find(m => m.id === cm.monsterId);
    if (!monsterData) {
      return { success: false, message: "몬스터 메타데이터를 찾을 수 없습니다." };
    }

    // Consume potion
    items.expPotions -= 1;
    cm.exp += 10; // EXP Potion gives 10 EXP

    let newLevel = undefined;
    
    while (cm.level < 5) {
      const requiredExp = monsterData.baseExpToNextLevel * cm.level;
      if (cm.exp >= requiredExp) {
        cm.exp -= requiredExp;
        cm.level += 1;
        newLevel = cm.level;
        
        // Try to call backend level up API
        try {
           const userInfo = await this.getUserInfo();
           const userId = userInfo.userId || 1;
           await fetch(`${process.env.PLASMO_PUBLIC_API_URL || "http://localhost:8080/api"}/user-monsters/${cm.id}/levelup`, {
              method: "POST",
              headers: {
                 "X-User-Id": userId.toString()
              }
           });
        } catch (e) {
           console.error("Backend levelup connection failed:", e);
        }
      } else {
        break;
      }
    }

    if (cm.level >= 5) {
      cm.exp = 0; // Cap EXP at Max Level
    }

    // Save to storage
    inventory.items = items;
    await storage.set("inventory", inventory);

    // Sync achievements
    try {
      const { questService } = await import("./questService");
      await questService.syncAchievements();
    } catch (e) {
      console.error("Failed to sync achievements after potion use:", e);
    }

    let msg = `EXP 물약을 사용했습니다! (+10 EXP)`;
    if (newLevel) {
      msg = `${monsterData.name}(이)가 레벨업하여 Lv.${newLevel}(이)가 되었습니다! 🎉`;
    }

    return { success: true, newLevel, message: msg };
  }

  async evolveMonster(caughtMonsterId: string): Promise<{ success: boolean; newStage?: number; message: string }> {
    const inventory = await this.getInventory();
    const items = inventory.items || { expPotions: 0, evolutionStones: 0 };

    const cm = inventory.caughtMonsters.find(m => m.id === caughtMonsterId);
    if (!cm) {
      return { success: false, message: "몬스터를 찾을 수 없습니다." };
    }

    const currentStage = cm.evolutionStage || 1;
    if (currentStage >= 3) {
      return { success: false, message: "이미 최종 진화 상태입니다!" };
    }

    const monsters = await this.getMonsterList();
    const monsterData = monsters.find(m => m.id === cm.monsterId);
    if (!monsterData) {
      return { success: false, message: "몬스터 메타데이터를 찾을 수 없습니다." };
    }

    if (currentStage === 1) {
      // Evolve to Stage 2: Requires level >= 3 and 1 stone
      if (cm.level < 3) {
        return { success: false, message: `진화하려면 레벨이 3 이상이어야 합니다. (현재 Lv.${cm.level})` };
      }
      if (items.evolutionStones < 1) {
        return { success: false, message: "진화의 돌이 부족합니다! (1개 필요)" };
      }
      
      // Deduct stone
      items.evolutionStones -= 1;
      cm.evolutionStage = 2;
      
      inventory.items = items;
      await storage.set("inventory", inventory);

      // Call backend evolve API (best effort)
      try {
         const userInfo = await this.getUserInfo();
         const userId = userInfo.userId || 1;
         await fetch(`${process.env.PLASMO_PUBLIC_API_URL || "http://localhost:8080/api"}/user-monsters/${cm.id}/evolve`, {
            method: "PATCH",
            headers: {
               "X-User-Id": userId.toString()
            }
         });
      } catch (e) {
         console.error("Backend evolve connection failed:", e);
      }

      // Sync achievements
      try {
        const { questService } = await import("./questService");
        await questService.syncAchievements();
      } catch (e) {
        console.error("Failed to sync achievements after evolution:", e);
      }

      const evolvedName = getEvolvedMonsterData(monsterData, 2).name;
      return { success: true, newStage: 2, message: `축하합니다! ${monsterData.name}(이)가 ${evolvedName}(으)로 진화했습니다! 🎉` };
    } else if (currentStage === 2) {
      // Evolve to Stage 3: Requires level >= 5 and 2 stones
      if (cm.level < 5) {
        return { success: false, message: `최종 진화하려면 레벨이 5여야 합니다. (현재 Lv.${cm.level})` };
      }
      if (items.evolutionStones < 2) {
        return { success: false, message: "진화의 돌이 부족합니다! (2개 필요)" };
      }
      
      // Deduct stones
      items.evolutionStones -= 2;
      cm.evolutionStage = 3;

      inventory.items = items;
      await storage.set("inventory", inventory);

      // Call backend evolve API (best effort)
      try {
         const userInfo = await this.getUserInfo();
         const userId = userInfo.userId || 1;
         await fetch(`${process.env.PLASMO_PUBLIC_API_URL || "http://localhost:8080/api"}/user-monsters/${cm.id}/evolve`, {
            method: "PATCH",
            headers: {
               "X-User-Id": userId.toString()
            }
         });
      } catch (e) {
         console.error("Backend evolve connection failed:", e);
      }

      // Sync achievements
      try {
        const { questService } = await import("./questService");
        await questService.syncAchievements();
      } catch (e) {
        console.error("Failed to sync achievements after evolution:", e);
      }

      const evolvedName = getEvolvedMonsterData(monsterData, 3).name;
      return { success: true, newStage: 3, message: `축하합니다! 최종 형태인 ${evolvedName}(으)로 진화 완료했습니다! 🌟` };
    }

    return { success: false, message: "올바르지 않은 진화 단계입니다." };
  }

  async addItems(potions: number, stones: number): Promise<Inventory> {
    const inventory = await this.getInventory();
    if (!inventory.items) {
      inventory.items = { expPotions: 0, evolutionStones: 0 };
    }
    inventory.items.expPotions += potions;
    inventory.items.evolutionStones += stones;
    await storage.set("inventory", inventory);
    return inventory;
  }
}

export const monsterService: IMonsterService = new BackendMonsterService();

