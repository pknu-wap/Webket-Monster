import { Storage } from "@plasmohq/storage";
import { monsterService } from "./monsterService";

const storage = new Storage();

export interface QuestReward {
  expPotions: number;
  evolutionStones: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: "daily" | "achievement";
  category: "visit" | "catch" | "active" | "level" | "count";
  targetCount: number;
  currentCount: number;
  reward: QuestReward;
  completed: boolean;
  claimed: boolean;
}

const DEFAULT_QUESTS: Quest[] = [
  // Daily Quests
  {
    id: "visit_pknu",
    title: "부경대학교 사이트 방문",
    description: "부경대학교 공식 사이트에 접속하여 몬스터와 조우하세요.",
    type: "daily",
    category: "visit",
    targetCount: 1,
    currentCount: 0,
    reward: { expPotions: 1, evolutionStones: 0 },
    completed: false,
    claimed: false
  },
  {
    id: "catch_monster",
    title: "야생 몬스터 포획 시도",
    description: "오늘 야생 몬스터를 1회 포획하세요.",
    type: "daily",
    category: "catch",
    targetCount: 1,
    currentCount: 0,
    reward: { expPotions: 1, evolutionStones: 0 },
    completed: false,
    claimed: false
  },
  {
    id: "equip_monster",
    title: "몬스터 활성화하기",
    description: "트레이너 정보에서 몬스터를 장착하여 동행하세요.",
    type: "daily",
    category: "active",
    targetCount: 1,
    currentCount: 0,
    reward: { expPotions: 1, evolutionStones: 0 },
    completed: false,
    claimed: false
  },
  // Achievements
  {
    id: "first_catch",
    title: "첫 포획 성공!",
    description: "생애 처음으로 야생 몬스터를 안전하게 포획하세요.",
    type: "achievement",
    category: "count",
    targetCount: 1,
    currentCount: 0,
    reward: { expPotions: 0, evolutionStones: 1 },
    completed: false,
    claimed: false
  },
  {
    id: "catch_5",
    title: "몬스터 포획 마스터",
    description: "몬스터를 총 5회 이상 포획하세요.",
    type: "achievement",
    category: "count",
    targetCount: 5,
    currentCount: 0,
    reward: { expPotions: 1, evolutionStones: 2 },
    completed: false,
    claimed: false
  },
  {
    id: "catch_10",
    title: "몬스터 포획 그랜드마스터",
    description: "몬스터를 총 10회 이상 포획하세요.",
    type: "achievement",
    category: "count",
    targetCount: 10,
    currentCount: 0,
    reward: { expPotions: 2, evolutionStones: 3 },
    completed: false,
    claimed: false
  },
  {
    id: "reach_lv3",
    title: "성장기 트레이너",
    description: "몬스터 한 마리를 3레벨 이상으로 성장시키세요.",
    type: "achievement",
    category: "level",
    targetCount: 1,
    currentCount: 0,
    reward: { expPotions: 1, evolutionStones: 1 },
    completed: false,
    claimed: false
  },
  {
    id: "reach_lv5",
    title: "진화 마스터",
    description: "몬스터 한 마리를 최대 레벨인 5레벨로 달성하세요.",
    type: "achievement",
    category: "level",
    targetCount: 1,
    currentCount: 0,
    reward: { expPotions: 2, evolutionStones: 2 },
    completed: false,
    claimed: false
  }
];

export interface IQuestService {
  getQuests(): Promise<Quest[]>;
  incrementProgress(category: "visit" | "catch" | "active" | "level" | "count", amount: number): Promise<Quest[]>;
  syncAchievements(): Promise<Quest[]>;
  claimReward(questId: string): Promise<{ success: boolean; message: string; reward?: QuestReward }>;
}

export class QuestService implements IQuestService {
  private getTodayString(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  async getQuests(): Promise<Quest[]> {
    const todayStr = this.getTodayString();
    const lastDate = await storage.get<string>("lastQuestDate");
    const storedQuests = await storage.get<Quest[]>("quests");

    // Check if new day or no stored quests
    if (!storedQuests || lastDate !== todayStr) {
      let questsToSave = [...DEFAULT_QUESTS];

      if (storedQuests) {
        // Keep achievement progress and claim status across days
        questsToSave = DEFAULT_QUESTS.map(dq => {
          if (dq.type === "achievement") {
            const existing = storedQuests.find(q => q.id === dq.id);
            if (existing) {
              return { ...dq, currentCount: existing.currentCount, completed: existing.completed, claimed: existing.claimed };
            }
          }
          return dq; // Reset daily quests
        });
      }

      await storage.set("quests", questsToSave);
      await storage.set("lastQuestDate", todayStr);
      
      // Perform initial sync for achievements based on current stats
      return this.syncQuests(questsToSave);
    }

    return this.syncQuests(storedQuests);
  }

  private async syncQuests(quests: Quest[]): Promise<Quest[]> {
    let updated = false;

    // Load active status
    const userInfo = await monsterService.getUserInfo();
    const inventory = await monsterService.getInventory();

    const maxLevel = inventory.caughtMonsters.reduce((max, cm) => Math.max(max, cm.level), 0);
    const totalCaught = userInfo.totalCaught;

    const newQuests = quests.map(q => {
      let newCount = q.currentCount;
      if (q.id === "first_catch") {
        newCount = totalCaught >= 1 ? 1 : 0;
      } else if (q.id === "catch_5") {
        newCount = Math.min(5, totalCaught);
      } else if (q.id === "catch_10") {
        newCount = Math.min(10, totalCaught);
      } else if (q.id === "reach_lv3") {
        newCount = maxLevel >= 3 ? 1 : 0;
      } else if (q.id === "reach_lv5") {
        newCount = maxLevel >= 5 ? 1 : 0;
      } else if (q.id === "equip_monster") {
        newCount = userInfo.activeMonsterId ? 1 : q.currentCount;
      }

      if (newCount !== q.currentCount) {
        updated = true;
        const completed = newCount >= q.targetCount;
        return { ...q, currentCount: newCount, completed: completed || q.completed };
      }
      return q;
    });

    if (updated) {
      await storage.set("quests", newQuests);
      return newQuests;
    }
    return quests;
  }

  async incrementProgress(category: "visit" | "catch" | "active" | "level" | "count", amount: number): Promise<Quest[]> {
    const quests = await this.getQuests();
    let updated = false;

    const newQuests = quests.map(q => {
      if (q.category === category && q.type === "daily" && !q.completed) {
        updated = true;
        const newCount = Math.min(q.targetCount, q.currentCount + amount);
        return {
          ...q,
          currentCount: newCount,
          completed: newCount >= q.targetCount
        };
      }
      return q;
    });

    if (updated) {
      await storage.set("quests", newQuests);
      return newQuests;
    }
    return quests;
  }

  async syncAchievements(): Promise<Quest[]> {
    const quests = await this.getQuests();
    return this.syncQuests(quests);
  }

  async claimReward(questId: string): Promise<{ success: boolean; message: string; reward?: QuestReward }> {
    const quests = await this.getQuests();
    const questIndex = quests.findIndex(q => q.id === questId);

    if (questIndex === -1) {
      return { success: false, message: "퀘스트를 찾을 수 없습니다." };
    }

    const quest = quests[questIndex];
    if (!quest.completed) {
      return { success: false, message: "아직 완료되지 않은 퀘스트입니다." };
    }
    if (quest.claimed) {
      return { success: false, message: "이미 보상을 받았습니다." };
    }

    // Mark as claimed
    quest.claimed = true;
    quests[questIndex] = quest;

    // Grant items
    await monsterService.addItems(quest.reward.expPotions, quest.reward.evolutionStones);

    // Save
    await storage.set("quests", quests);

    let rewardMsg = "보상을 획득했습니다: ";
    const parts: string[] = [];
    if (quest.reward.expPotions > 0) parts.push(`🧪 EXP 물약 ${quest.reward.expPotions}개`);
    if (quest.reward.evolutionStones > 0) parts.push(`💎 진화의 돌 ${quest.reward.evolutionStones}개`);
    rewardMsg += parts.join(", ");

    return {
      success: true,
      message: rewardMsg,
      reward: quest.reward
    };
  }
}

export const questService: IQuestService = new QuestService();
