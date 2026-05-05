import { Storage } from "@plasmohq/storage";

const storage = new Storage();

export interface MonsterEvolution {
  levelThreshold: number;
  name: string;
  imageUrl: string;
}

export interface Monster {
  id: string;
  name: string;
  imageUrl: string;
  probability: number; // 0 to 1
  baseExpToNextLevel: number;
  evolutions?: MonsterEvolution[];
}

export interface CaughtMonster {
  id: string; // unique instance ID or could just be monsterId if 1 per type
  monsterId: string;
  level: number;
  exp: number;
}

export interface UserInfo {
  nickname: string;
  totalCaught: number;
  activeMonsterId?: string | null;
  showActiveMonster?: boolean;
  spawnWildMonsters?: boolean;
}

export interface Inventory {
  caughtMonsters: CaughtMonster[];
}

import ppugongImg from "url:~assets/ppugong.png";
import baekgyongImg from "url:~assets/baekgyong.png";
import baekgyongAndPpugongImg from "url:~assets/baekgyong_and_ppugong.png";

// Mock Monster Data
const MOCK_MONSTERS: Monster[] = [
  {
    id: "pknu_01",
    name: "뿌공이",
    imageUrl: ppugongImg,
    probability: 1.0, // 100% chance
    baseExpToNextLevel: 10,
    evolutions: [
      {
        levelThreshold: 3,
        name: "백경이",
        imageUrl: baekgyongImg
      },
      {
        levelThreshold: 5,
        name: "백경이와 뿌공이",
        imageUrl: baekgyongAndPpugongImg
      }
    ]
  }
];

export function getEvolvedMonsterData(monster: Monster, level: number): { name: string; imageUrl: string } {
  let currentName = monster.name;
  let currentImage = monster.imageUrl;

  if (monster.evolutions) {
    const sortedEvolutions = [...monster.evolutions].sort((a, b) => b.levelThreshold - a.levelThreshold);
    for (const evo of sortedEvolutions) {
      if (level >= evo.levelThreshold) {
        currentName = evo.name;
        currentImage = evo.imageUrl;
        break;
      }
    }
  }

  return { name: currentName, imageUrl: currentImage };
}

export interface IMonsterService {
  getUserInfo(): Promise<UserInfo>;
  getMonsterList(): Promise<Monster[]>;
  getInventory(): Promise<Inventory>;
  catchMonster(monsterId: string): Promise<{ success: boolean; newLevel?: number; message: string }>;
  setActiveMonster(caughtMonsterId: string | null): Promise<void>;
  toggleActiveMonsterDisplay(show: boolean): Promise<void>;
  toggleWildMonsterSpawn(show: boolean): Promise<void>;
}

export class MockMonsterService implements IMonsterService {
  async getUserInfo(): Promise<UserInfo> {
    const userInfo = await storage.get<UserInfo>("userInfo");
    if (!userInfo) {
      const defaultInfo = { nickname: "Tamer", totalCaught: 0, activeMonsterId: null };
      await storage.set("userInfo", defaultInfo);
      return defaultInfo;
    }
    return userInfo;
  }

  async setActiveMonster(caughtMonsterId: string | null): Promise<void> {
    const userInfo = await this.getUserInfo();
    userInfo.activeMonsterId = caughtMonsterId;
    await storage.set("userInfo", userInfo);
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
    const inventory = await storage.get<Inventory>("inventory");
    if (!inventory) {
      const defaultInventory = { caughtMonsters: [] };
      await storage.set("inventory", defaultInventory);
      return defaultInventory;
    }
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
        existingMonster.exp += 5; // Fixed exp per catch for now
        const requiredExp = monsterData.baseExpToNextLevel * existingMonster.level;

        if (existingMonster.exp >= requiredExp) {
          existingMonster.level += 1;
          existingMonster.exp = 0;
          newLevel = existingMonster.level;
          message = `Your ${monsterData.name} leveled up to Lv.${newLevel}!`;
        } else {
          message = `You caught another ${monsterData.name}! EXP increased.`;
        }
      } else {
        message = `You caught a ${monsterData.name}, but it's already Max Level (Lv.5).`;
      }
    } else {
      // New monster
      inventory.caughtMonsters.push({
        id: `cm_${Date.now()}`,
        monsterId: monsterId,
        level: 1,
        exp: 0
      });
      message = `You discovered and caught a new monster: ${monsterData.name}!`;
    }

    // Update user info
    userInfo.totalCaught += 1;

    // Save to storage
    await storage.set("inventory", inventory);
    await storage.set("userInfo", userInfo);

    return { success: true, newLevel, message };
  }
}

export const monsterService: IMonsterService = new MockMonsterService();
