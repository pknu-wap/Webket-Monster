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
  // 1. 먹이 10번 주기
  {
    id: "feed_10",
    title: "꼬꼬마 맘마 주기",
    description: "활성화된 몬스터에게 먹이를 총 10번 이상 주입하세요.",
    type: "daily",
    category: "count",
    targetCount: 10,
    currentCount: 0,
    reward: { expPotions: 1, evolutionStones: 2 },
    completed: false,
    claimed: false
  },
  // 2. 먹이 100번 주기
  {
    id: "feed_100",
    title: "위대한 트레이너",
    description: "활성화된 몬스터에게 먹이를 총 100번 이상 주입하세요.",
    type: "achievement",
    category: "count",
    targetCount: 100,
    currentCount: 0,
    reward: { expPotions: 5, evolutionStones: 5 },
    completed: false,
    claimed: false
  },
  // 3. 몬스터 출현 8개 사이트 모두 방문
  {
    id: "visit_all_8",
    title: "진정한 정보 탐험가",
    description: "몬스터가 스폰되는 8가지 테마 사이트를 모두 1회씩 방문하세요.",
    type: "daily",
    category: "visit",
    targetCount: 8,
    currentCount: 0,
    reward: { expPotions: 0, evolutionStones: 1 },
    completed: false,
    claimed: false
  },
  // 4. 5대 AI 사이트 모두 방문
  {
    id: "visit_ai_5",
    title: "인공지능 연구가",
    description: "ChatGPT, Grok, Claude, Gemini, Perplexity 사이트를 모두 1회씩 방문하세요.",
    type: "daily",
    category: "visit",
    targetCount: 5,
    currentCount: 0,
    reward: { expPotions: 0, evolutionStones: 3 },
    completed: false,
    claimed: false
  },
  // 5. Gemini, YouTube, Google 각각 10회 방문
  {
    id: "visit_gemini_yt_google_10",
    title: "기술의 지배자",
    description: "Gemini, YouTube, Google 사이트를 각각 10회 이상 방문하세요.",
    type: "daily",
    category: "visit",
    targetCount: 3,
    currentCount: 0,
    reward: { expPotions: 0, evolutionStones: 3 },
    completed: false,
    claimed: false
  },
  // 6. 네이버몬, 나무위키몬 획득
  {
    id: "obtain_naver_namuwiki",
    title: "한국형 정보 연맹",
    description: "네이버몬과 나무위키몬을 모두 최소 1회 이상 획득하세요.",
    type: "achievement",
    category: "catch",
    targetCount: 1,
    currentCount: 0,
    reward: { expPotions: 0, evolutionStones: 1 },
    completed: false,
    claimed: false
  },
  // 7. 모든 몬스터 획득
  {
    id: "obtain_all_monsters",
    title: "도감 마스터",
    description: "총 8개 종류의 마스코트 몬스터를 종류별로 최소 1회 이상 포획하세요.",
    type: "achievement",
    category: "catch",
    targetCount: 8,
    currentCount: 0,
    reward: { expPotions: 0, evolutionStones: 2 },
    completed: false,
    claimed: false
  },
  // 8. 부경대 최종진화버전 획득
  {
    id: "obtain_pknu_final",
    title: "백경이와 뿌공이의 친구",
    description: "부경대 몬스터의 최종 진화형(백경이와 뿌공이)을 획득하세요.",
    type: "achievement",
    category: "catch",
    targetCount: 1,
    currentCount: 0,
    reward: { expPotions: 0, evolutionStones: 1 },
    completed: false,
    claimed: false
  }
];

export interface IQuestService {
  getQuests(): Promise<Quest[]>;
  incrementProgress(category: "visit" | "catch" | "active" | "level" | "count", amount: number): Promise<Quest[]>;
  syncAchievements(): Promise<Quest[]>;
  claimReward(questId: string): Promise<{ success: boolean; message: string; reward?: QuestReward }>;
  recordPageVisit(hostname: string): Promise<Quest[]>;
}

export class QuestService implements IQuestService {
  async getQuests(): Promise<Quest[]> {
    try {
      const userInfo = await monsterService.getUserInfo();
      const userId = userInfo.userId || 1;
      
      const res = await fetch(`${process.env.PLASMO_PUBLIC_API_URL || "http://localhost:8080/api"}/users/${userId}/quests`, {
        headers: {
          "X-User-Id": userId.toString()
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        const quests: Quest[] = data.map((q: any) => ({
          id: q.id,
          title: q.title,
          description: q.description,
          type: q.type,
          category: q.category,
          targetCount: q.targetCount,
          currentCount: q.currentCount,
          completed: q.completed,
          claimed: q.claimed,
          reward: {
            expPotions: q.reward.expPotions,
            evolutionStones: q.reward.evolutionStones
          }
        }));
        
        await storage.set("quests", quests);
        return quests;
      }
    } catch (e) {
      console.warn("Backend quests fetch offline, using local fallback:", e);
    }
    
    // Fallback to local storage
    const stored = await storage.get<Quest[]>("quests");
    return stored || [];
  }

  async incrementProgress(category: "visit" | "catch" | "active" | "level" | "count", amount: number): Promise<Quest[]> {
    // Backend automatically calculates and increments progress on catch, feed, and page visit APIs.
    // We just fetch the updated quest list.
    return await this.getQuests();
  }

  async syncAchievements(): Promise<Quest[]> {
    // Backend automatically recalculates all achievements dynamically on getUserQuests.
    return await this.getQuests();
  }

  async recordPageVisit(hostname: string): Promise<Quest[]> {
    const domain = this.normalizeDomain(hostname);
    if (!domain) return await this.getQuests();

    // Log to visited set locally as well for offline fallback
    let visitedDomains = await storage.get<string[]>("visitedDomains") || [];
    if (!visitedDomains.includes(domain)) {
      visitedDomains.push(domain);
      await storage.set("visitedDomains", visitedDomains);
    }

    try {
      const userInfo = await monsterService.getUserInfo();
      const userId = userInfo.userId || 1;
      
      const res = await fetch(`${process.env.PLASMO_PUBLIC_API_URL || "http://localhost:8080/api"}/users/${userId}/sync-activity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId.toString()
        },
        body: JSON.stringify({
          hostname: hostname
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.triggerAction1) {
          await storage.set("activeMonsterTrigger", "action1");
        }
      }
    } catch (e) {
      console.warn("Backend activity sync offline, using local fallback:", e);
    }

    return await this.getQuests();
  }

  private normalizeDomain(hostname: string): string | null {
    const host = hostname.toLowerCase();
    if (host.includes("pknu.ac.kr")) return "pknu.ac.kr";
    if (host.includes("gemini.google.com")) return "gemini.google.com";
    if (host.includes("google.com") || host.includes("google.co.kr")) return "google.com";
    if (host.includes("naver.com")) return "naver.com";
    if (host.includes("youtube.com")) return "youtube.com";
    if (host.includes("github.com")) return "github.com";
    if (host.includes("linkedin.com")) return "linkedin.com";
    if (host.includes("namu.wiki")) return "namu.wiki";
    if (host.includes("chatgpt.com") || host.includes("openai.com")) return "chatgpt.com";
    // x.com/i/grok: hostname is "x.com", check path in window.location
    if (host === "x.com" || host.includes("grok.com")) return "grok.com";
    if (host.includes("claude.ai")) return "claude.ai";
    if (host.includes("perplexity.ai")) return "perplexity.ai";
    return null;
  }

  private getMonsterHomeDomain(monsterId: string): string | null {
    const id = parseInt(monsterId.replace(/[^0-9]/g, "")) || 1;
    if (id >= 1 && id <= 3) return "pknu.ac.kr";
    if (id >= 4 && id <= 6) return "google.com";
    if (id >= 7 && id <= 9) return "naver.com";
    if (id >= 10 && id <= 12) return "youtube.com";
    if (id >= 13 && id <= 15) return "github.com";
    if (id >= 16 && id <= 18) return "linkedin.com";
    if (id >= 19 && id <= 21) return "namu.wiki";
    if (id >= 22 && id <= 24) return "chatgpt.com";
    return null;
  }

  async claimReward(questId: string): Promise<{ success: boolean; message: string; reward?: QuestReward }> {
    try {
      const userInfo = await monsterService.getUserInfo();
      const userId = userInfo.userId || 1;
      
      const res = await fetch(`${process.env.PLASMO_PUBLIC_API_URL || "http://localhost:8080/api"}/users/${userId}/quests/${questId}/claim`, {
        method: "POST",
        headers: {
          "X-User-Id": userId.toString()
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          // Sync inventory items immediately after successful claim
          await monsterService.getInventory();
          
          return {
            success: true,
            message: data.message,
            reward: {
              expPotions: data.expPotionsReward,
              evolutionStones: data.evolutionStonesReward
            }
          };
        } else {
          return { success: false, message: data.message };
        }
      } else {
         const errorText = await res.text();
         return { success: false, message: errorText || "보상 받기 실패" };
      }
    } catch (e) {
      console.error("Backend claimReward failed:", e);
      return { success: false, message: "백엔드 연결에 실패했습니다." };
    }
  }
}

export const questService: IQuestService = new QuestService();
