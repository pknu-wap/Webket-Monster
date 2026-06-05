import { useEffect, useState } from "react";
import { Storage } from "@plasmohq/storage";
import { monsterService, UserInfo, Inventory, Monster, getEvolvedMonsterData, getRequiredExpForLevel } from "./services/monsterService";
import { questService, Quest } from "./services/questService";

export default function IndexPopup() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [activeTab, setActiveTab] = useState<"info" | "inventory" | "quest">("info");
  const [quests, setQuests] = useState<Quest[]>([]);
  const [questSubTab, setQuestSubTab] = useState<"daily" | "achievement">("daily");
  const [message, setMessage] = useState<string | null>(null);

  const loadData = async () => {
    setUserInfo(await monsterService.getUserInfo());
    setInventory(await monsterService.getInventory());
    setMonsters(await monsterService.getMonsterList());
    setQuests(await questService.getQuests());
  };

  const refreshQuests = async () => {
    setQuests(await questService.getQuests());
  };

  useEffect(() => {
    loadData();
  }, []);

  // 퀘스트 탭 전환 시 자동 새로고침
  useEffect(() => {
    if (activeTab === "quest") {
      refreshQuests();
    }
  }, [activeTab]);

  // 30초마다 퀘스트 자동 폴링
  useEffect(() => {
    const interval = setInterval(() => {
      refreshQuests();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // content.tsx에서 먹이주기 발생 시 인벤토리 실시간 반영
  useEffect(() => {
    const storage = new Storage();
    const unwatch = storage.watch({
      "inventory": async () => {
        setInventory(await monsterService.getInventory());
      },
      "userInfo": async () => {
        setUserInfo(await monsterService.getUserInfo());
      }
    });
    return () => { unwatch(); };
  }, []);

  const handleSetActive = async (caughtMonsterId: string) => {
    await monsterService.setActiveMonster(caughtMonsterId);
    await loadData();
  };

  const handleUnequip = async () => {
    await monsterService.setActiveMonster(null);
    await loadData();
  };

  if (!userInfo || !inventory) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "white", backgroundColor: "#2b2b36", minHeight: 400, fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace" }}>
        데이터를 불러오는 중...
      </div>
    );
  }

  const getMonsterData = (id: string) => monsters.find(m => m.id === id);

  return (
    <div style={{
      width: 340,
      minHeight: 470,
      fontFamily: "'NeoDunggeunmo', 'Jua', 'Nanum Gothic', sans-serif",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#1a1a24",
      backgroundImage: "linear-gradient(to bottom, #1a1a24 0%, #2b2b36 100%)",
      color: "#ffffff",
      userSelect: "none",
      position: "relative"
    }}>
      {/* Toast Notification Message */}
      {message && (
        <div style={{
          position: "absolute",
          top: "60px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(46, 204, 113, 0.95)",
          color: "white",
          padding: "8px 12px",
          borderRadius: "8px",
          zIndex: 10000,
          fontWeight: "bold",
          fontSize: "12px",
          textAlign: "center",
          boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
          border: "2px solid #2ecc71",
          width: "80%",
          animation: "slideDown 0.2s ease"
        }}>
          {message}
        </div>
      )}

      {/* Header */}
      <div style={{ 
        padding: "14px 16px", 
        backgroundColor: "#4a3b69", 
        borderBottom: "4px solid #2d2440",
        boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
        textAlign: "center",
        position: "relative"
      }}>
        <h1 style={{ margin: 0, fontSize: "22px", color: "#f1c40f", textShadow: "2px 2px 0px #e67e22, 0 0 10px rgba(241,196,15,0.5)", fontWeight: "900", letterSpacing: "1px" }}>
          웹켓 몬스터
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#ecf0f1", fontWeight: "bold" }}>
          Lv.1 트레이너 <span style={{ color: "#3498db" }}>{userInfo.nickname}</span>님
        </p>
      </div>

      {/* Item Inventory Bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "8px 12px",
        backgroundColor: "#2c223e",
        borderBottom: "2px solid #2d2440",
        fontSize: "11px",
        fontWeight: "bold",
        color: "#fff",
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)"
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          🧪 EXP 물약: <span style={{ color: "#2ecc71", fontWeight: "900" }}>{inventory.items?.expPotions ?? 0}</span>개
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          💎 진화의 돌: <span style={{ color: "#f1c40f", fontWeight: "900" }}>{inventory.items?.evolutionStones ?? 0}</span>개
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "4px solid #2d2440", backgroundColor: "#34294a" }}>
        <button
          onClick={() => setActiveTab("info")}
          style={{
            flex: 1,
            padding: "10px 4px",
            background: activeTab === "info" ? "#4a3b69" : "transparent",
            border: "none",
            borderRight: "2px solid #2d2440",
            color: activeTab === "info" ? "#f1c40f" : "#95a5a6",
            cursor: "pointer",
            fontWeight: "900",
            fontSize: "13px",
            transition: "all 0.2s"
          }}
        >
          트레이너
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          style={{
            flex: 1,
            padding: "10px 4px",
            background: activeTab === "inventory" ? "#4a3b69" : "transparent",
            border: "none",
            borderRight: "2px solid #2d2440",
            color: activeTab === "inventory" ? "#f1c40f" : "#95a5a6",
            cursor: "pointer",
            fontWeight: "900",
            fontSize: "13px",
            transition: "all 0.2s"
          }}
        >
          나의 몬스터
        </button>
        <button
          onClick={() => setActiveTab("quest")}
          style={{
            flex: 1,
            padding: "10px 4px",
            background: activeTab === "quest" ? "#4a3b69" : "transparent",
            border: "none",
            color: activeTab === "quest" ? "#f1c40f" : "#95a5a6",
            cursor: "pointer",
            fontWeight: "900",
            fontSize: "13px",
            transition: "all 0.2s"
          }}
        >
          퀘스트
        </button>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
        {activeTab === "info" && (
          <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
            
            {/* Active Monster Card */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "8px" }}>
              <h2 style={{ fontSize: "17px", margin: 0, color: "#f1c40f", textShadow: "1px 1px 0px #000" }}>🚀 장착 중인 몬스터</h2>
              {userInfo.activeMonsterId && (
                <label style={{ display: "flex", alignItems: "center", cursor: "pointer", fontSize: "12px", color: "#bdc3c7", fontWeight: "bold" }}>
                  <input
                    type="checkbox"
                    checked={userInfo.showActiveMonster !== false}
                    onChange={async (e) => {
                      await monsterService.toggleActiveMonsterDisplay(e.target.checked);
                      setUserInfo(await monsterService.getUserInfo());
                    }}
                    style={{ marginRight: "4px", accentColor: "#e74c3c" }}
                  />
                  화면에 표시
                </label>
              )}
            </div>
            
            <div style={{ 
              background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)", 
              padding: "14px", 
              borderRadius: "12px", 
              border: "2px solid #7f8c8d",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.5), 0 4px 6px rgba(0,0,0,0.2)",
              marginBottom: "20px", 
              display: "flex", 
              alignItems: "center" 
            }}>
              {userInfo.activeMonsterId ? (() => {
                const activeCm = inventory.caughtMonsters.find(cm => cm.id === userInfo.activeMonsterId);
                const activeBaseData = activeCm ? getMonsterData(activeCm.monsterId) : null;
                if (!activeCm || !activeBaseData) return <span style={{ color: "#e74c3c", fontSize: "14px", fontWeight: "bold" }}>데이터 오류!</span>;
                const activeEvolvedData = getEvolvedMonsterData(activeBaseData, activeCm.evolutionStage || 1);
                return (
                  <>
                    <div style={{ 
                      background: "rgba(255,255,255,0.1)", 
                      borderRadius: "50%", 
                      padding: "4px", 
                      marginRight: "16px",
                      boxShadow: "0 0 10px rgba(46, 204, 113, 0.5)"
                    }}>
                      <img src={activeEvolvedData.imageUrl} alt={activeEvolvedData.name} style={{ width: 56, height: 56, filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.5))" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "900", fontSize: "18px", color: "#fff", textShadow: "1px 1px 2px #000" }}>{activeEvolvedData.name}</div>
                      <div style={{ display: "inline-block", background: "#27ae60", padding: "2px 8px", borderRadius: "10px", fontSize: "12px", color: "#fff", fontWeight: "bold", marginTop: "6px", boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.2)" }}>
                        Lv.{activeCm.level}
                      </div>
                    </div>
                  </>
                );
              })() : (
                <div style={{ textAlign: "center", width: "100%", color: "#95a5a6", fontSize: "14px", fontWeight: "bold", padding: "10px 0" }}>
                  현재 장착 중인 몬스터가 없습니다.
                </div>
              )}
            </div>

            {userInfo.activeMonsterId && (() => {
              const activeCm = inventory.caughtMonsters.find(cm => cm.id === userInfo.activeMonsterId);
              if (!activeCm) return null;
              
              const currentStage = activeCm.evolutionStage || 1;
              const showActions = currentStage >= 2;
              const showEffect = currentStage === 3;
              
              const triggerAnimation = async (type: "hungry" | "feed" | "action1" | "action2") => {
                const storage = new Storage();
                await storage.set("activeMonsterTrigger", type);
                
                let triggerMsg = "";
                if (type === "hungry") triggerMsg = "drooling... 몬스터가 배고파합니다! 🥩";
                else if (type === "feed") triggerMsg = "얌냠! 맛있게 먹고 행복해합니다! 🍎✨";
                else if (type === "action1") triggerMsg = "⚡ 액션 1 기술 시전!";
                else if (type === "action2") triggerMsg = "🔥 액션 2 필살기 시전!";

                setMessage(triggerMsg);
                setTimeout(() => setMessage(null), 3000);
              };

              // 실제 먹이주기 (퀘스트 카운트 포함)
              const handleActualFeed = async () => {
                try {
                  const userInfo = await monsterService.getUserInfo();
                  const userId = userInfo.userId || 1;
                  // 배고픔 체크 없이 직접 sync-activity로 feed 카운트 증가
                  const syncRes = await fetch(
                    `${process.env.PLASMO_PUBLIC_API_URL || "http://localhost:8080/api"}/users/${userId}/sync-activity`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json", "X-User-Id": userId.toString() },
                      body: JSON.stringify({ feedIncrement: 1 })
                    }
                  );
                  if (syncRes.ok) {
                    setMessage("🍎 먹이주기 완료!");
                    // 해피 애니메이션도 동시에 트리거
                    const storage = new Storage();
                    await storage.set("activeMonsterTrigger", "feed");
                    // 퀘스트 새로고침
                    await refreshQuests();
                  } else {
                    setMessage("❌ 먹이주기 실패, 다시 시도해주세요");
                  }
                } catch (e) {
                  console.error("Feed failed:", e);
                  setMessage("❌ 서버 연결 실패");
                }
                setTimeout(() => setMessage(null), 3000);
              };

              return (
                <div style={{
                  background: "#251d38",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "2px solid #4a3b69",
                  marginBottom: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  animation: "fadeIn 0.3s ease"
                }}>
                  <div style={{ fontSize: "12px", fontWeight: "900", color: "#f1c40f", display: "flex", alignItems: "center", gap: "4px" }}>
                    🎮 애니메이션 수동 테스트 컨트롤러
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                    <button
                      onClick={() => triggerAnimation("hungry")}
                      style={{
                        background: "linear-gradient(180deg, #f39c12 0%, #e67e22 100%)",
                        color: "white",
                        border: "1px solid #d35400",
                        borderRadius: "6px",
                        padding: "5px",
                        cursor: "pointer",
                        fontSize: "11px",
                        fontWeight: "bold",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
                      }}
                    >
                      🥩 배고픔 유도
                    </button>
                    <button
                      onClick={handleActualFeed}
                      style={{
                        background: "linear-gradient(180deg, #2ecc71 0%, #27ae60 100%)",
                        color: "white",
                        border: "1px solid #219a52",
                        borderRadius: "6px",
                        padding: "5px",
                        cursor: "pointer",
                        fontSize: "11px",
                        fontWeight: "bold",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
                      }}
                    >
                      🍎 먹이 주기 (+퀘스트)
                    </button>

                    {showActions && (
                      <>
                        <button
                          onClick={() => triggerAnimation("action1")}
                          style={{
                            background: "linear-gradient(180deg, #3498db 0%, #2980b9 100%)",
                            color: "white",
                            border: "1px solid #1f618d",
                            borderRadius: "6px",
                            padding: "5px",
                            cursor: "pointer",
                            fontSize: "11px",
                            fontWeight: "bold",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
                          }}
                        >
                          ⚡ 액션 1
                        </button>
                        <button
                          onClick={() => triggerAnimation("action2")}
                          style={{
                            background: "linear-gradient(180deg, #9b59b6 0%, #8e44ad 100%)",
                            color: "white",
                            border: "1px solid #763e8f",
                            borderRadius: "6px",
                            padding: "5px",
                            cursor: "pointer",
                            fontSize: "11px",
                            fontWeight: "bold",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
                          }}
                        >
                          🔥 액션 2
                        </button>
                      </>
                    )}

                    {showEffect && (
                      <button
                        onClick={async () => {
                          try {
                            const res = await monsterService.castEffect(activeCm.id);
                            const storage = new Storage();
                            await storage.set("activeMonsterTrigger", "effect");
                            
                            if (res.success) {
                              setMessage("✨ " + res.message);
                            } else {
                              console.warn("Backend effect API failed, executing local fallback overlay: ", res.message);
                              setMessage("✨ 로컬 이펙트 스킬 시전!");
                            }
                            setTimeout(() => setMessage(null), 3000);
                          } catch (e) {
                            console.error("Effect cast error:", e);
                            const storage = new Storage();
                            await storage.set("activeMonsterTrigger", "effect");
                            setMessage("✨ 로컬 이펙트 스킬 시전!");
                            setTimeout(() => setMessage(null), 3000);
                          }
                        }}
                        style={{
                          gridColumn: "span 2",
                          background: "linear-gradient(180deg, #f1c40f 0%, #d35400 100%)",
                          color: "white",
                          border: "2px solid #fff",
                          borderRadius: "6px",
                          padding: "6px",
                          cursor: "pointer",
                          fontSize: "11px",
                          fontWeight: "bold",
                          boxShadow: "0 0 10px rgba(241,196,15,0.6)",
                          textShadow: "1px 1px 0px rgba(0,0,0,0.4)",
                          marginTop: "4px"
                        }}
                        className="glowing-btn"
                      >
                        ✨ 이펙트 스킬 시전 (동영상 오버레이)
                      </button>
                    )}
                  </div>
                  {!showActions && (
                    <div style={{ fontSize: "9px", color: "#bdc3c7", textAlign: "center", marginTop: "2px" }}>
                      💡 액션 1, 2는 진화 2단계(레벨 3 이상)부터 활성화됩니다!
                    </div>
                  )}
                  {showActions && !showEffect && (
                    <div style={{ fontSize: "9px", color: "#bdc3c7", textAlign: "center", marginTop: "2px" }}>
                      💡 스킬 이펙트는 진화 3단계(최종 진화형)부터 활성화됩니다!
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Stats Card */}
            <h2 style={{ fontSize: "17px", marginTop: 0, color: "#f1c40f", textShadow: "1px 1px 0px #000" }}>📊 포획 현황</h2>
            <div style={{ 
              background: "#2c3e50", 
              padding: "14px", 
              borderRadius: "12px", 
              border: "2px solid #34495e",
              marginBottom: "20px" 
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", borderBottom: "1px dashed #7f8c8d", paddingBottom: "8px" }}>
                <span style={{ color: "#bdc3c7", fontWeight: "bold" }}>총 포획 횟수</span>
                <span style={{ color: "#fff", fontWeight: "900", fontSize: "16px" }}>{userInfo.totalCaught} 회</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#bdc3c7", fontWeight: "bold" }}>발견한 도감</span>
                <span style={{ color: "#3498db", fontWeight: "900", fontSize: "16px" }}>{inventory.caughtMonsters.length} / {monsters.length} 종</span>
              </div>
            </div>
            
            {/* System Settings */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "8px" }}>
              <h2 style={{ fontSize: "17px", margin: 0, color: "#f1c40f", textShadow: "1px 1px 0px #000" }}>🌍 야생 몬스터 출현</h2>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer", fontSize: "12px", color: "#bdc3c7", fontWeight: "bold" }}>
                <input
                  type="checkbox"
                  checked={userInfo.spawnWildMonsters !== false}
                  onChange={async (e) => {
                    await monsterService.toggleWildMonsterSpawn(e.target.checked);
                    setUserInfo(await monsterService.getUserInfo());
                  }}
                  style={{ marginRight: "4px", accentColor: "#27ae60" }}
                />
                출현 활성화
              </label>
            </div>
            <div style={{ background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "8px", borderLeft: "4px solid #f39c12", marginBottom: "20px" }}>
              <p style={{ margin: 0, color: "#ecf0f1", fontSize: "13px", lineHeight: "1.4" }}>
                웹서핑을 하는 동안 무작위로 야생 몬스터가 등장합니다! 마우스를 올려 포획하세요.
              </p>
            </div>

            <h2 style={{ fontSize: "17px", marginTop: 0, color: "#f1c40f", textShadow: "1px 1px 0px #000" }}>🔍 출현 가능 도감</h2>
            <div style={{ display: "grid", gap: "10px" }}>
              {monsters.map(m => (
                <div key={m.id} style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  background: "#2c3e50", 
                  padding: "10px", 
                  borderRadius: "10px",
                  border: "1px solid #7f8c8d"
                }}>
                  <div style={{ background: "#ecf0f1", borderRadius: "8px", padding: "2px", marginRight: "12px" }}>
                    <img src={m.imageUrl} alt={m.name} style={{ width: 36, height: 36, display: "block" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "900", color: "#fff", fontSize: "15px" }}>{m.name}</div>
                    <div style={{ fontSize: "12px", color: "#f39c12", fontWeight: "bold", marginTop: "2px" }}>출현 확률: {m.probability * 100}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "inventory" && (
          <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
            <h2 style={{ fontSize: "18px", marginTop: 0, color: "#f1c40f", textShadow: "1px 1px 0px #000", textAlign: "center", marginBottom: "16px" }}>나의 몬스터 박스</h2>
            
            {inventory.caughtMonsters.length === 0 ? (
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "30px 20px", borderRadius: "12px", textAlign: "center", border: "2px dashed #7f8c8d" }}>
                <p style={{ color: "#ecf0f1", fontSize: "14px", lineHeight: "1.6", fontWeight: "bold", margin: 0 }}>
                  아직 텅 비어있습니다.<br/><br/>
                  <span style={{ color: "#f1c40f" }}>웹서핑을 시작</span>하여<br/>새로운 몬스터를 포획하세요!
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {inventory.caughtMonsters.map(cm => {
                  const mBaseData = getMonsterData(cm.monsterId);
                  if (!mBaseData) return null;
                  
                  const currentStage = cm.evolutionStage || 1;
                  const mData = getEvolvedMonsterData(mBaseData, currentStage);
                  const requiredExp = getRequiredExpForLevel(cm.level);
                  const expPercent = cm.level >= 5 ? 100 : Math.min(100, (cm.exp / requiredExp) * 100);
                  const isMaxLevel = cm.level >= 5;

                  const canEvolveToStage2 = currentStage === 1 && cm.level >= 3;
                  const canEvolveToStage3 = currentStage === 2 && cm.level >= 5;
                  const hasStonesForStage2 = (inventory.items?.evolutionStones ?? 0) >= 1;
                  const hasStonesForStage3 = (inventory.items?.evolutionStones ?? 0) >= 2;

                  return (
                    <div key={cm.id} style={{ 
                      background: "linear-gradient(180deg, #34495e 0%, #2c3e50 100%)", 
                      padding: "12px 10px 10px", 
                      borderRadius: "12px", 
                      textAlign: "center",
                      border: "2px solid #7f8c8d",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}>
                      <div>
                        {/* Level Badge */}
                        <div style={{
                          position: "absolute",
                          top: "-8px",
                          left: "-8px",
                          background: isMaxLevel ? "#f1c40f" : "#27ae60",
                          color: isMaxLevel ? "#000" : "#fff",
                          padding: "4px 8px",
                          borderRadius: "8px",
                          fontSize: "11px",
                          fontWeight: "900",
                          border: "2px solid #fff",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                          zIndex: 1
                        }}>
                          Lv.{cm.level} {isMaxLevel && "MAX"}
                        </div>

                        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "50%", padding: "8px", marginBottom: "6px", display: "inline-block" }}>
                          <img src={mData.imageUrl} alt={mData.name} style={{ width: 56, height: 56, filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.4))" }} />
                        </div>
                        
                        <div style={{ fontWeight: "900", fontSize: "14px", color: "#fff", textShadow: "1px 1px 1px #000", marginBottom: "6px" }}>
                          {mData.name}
                        </div>
                        
                        {/* EXP Bar */}
                        {!isMaxLevel ? (
                          <div style={{ marginBottom: "8px" }}>
                            <div style={{ height: "6px", background: "#1a1a24", borderRadius: "3px", overflow: "hidden", border: "1px solid #555" }}>
                              <div style={{ height: "100%", width: `${expPercent}%`, background: "linear-gradient(90deg, #3498db 0%, #2ecc71 100%)", transition: "width 0.3s" }} />
                            </div>
                            <div style={{ fontSize: "10px", color: "#bdc3c7", marginTop: "3px", fontWeight: "bold" }}>EXP {cm.exp}/{requiredExp}</div>
                          </div>
                        ) : (
                          <div style={{ fontSize: "11px", color: "#f1c40f", fontWeight: "bold", padding: "2px 0 6px", textShadow: "0 0 5px rgba(241,196,15,0.5)" }}>
                            {currentStage === 3 ? "진화 완료!" : "진화 대기 상태"}
                          </div>
                        )}
                      </div>
                      
                      {/* Action buttons (Potion and Evolve) */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                        {/* Potion Use Button */}
                        {!isMaxLevel && (
                          <button
                            onClick={async () => {
                              const res = await monsterService.useExpPotion(cm.id);
                              if (res.success) {
                                setMessage(res.message);
                                setTimeout(() => setMessage(null), 3000);
                                await loadData();
                              } else {
                                alert(res.message);
                              }
                            }}
                            disabled={!inventory.items || inventory.items.expPotions <= 0}
                            style={{
                              background: (inventory.items && inventory.items.expPotions > 0) ? "linear-gradient(180deg, #2ecc71 0%, #27ae60 100%)" : "#7f8c8d",
                              color: "white",
                              border: "1px solid #27ae60",
                              borderRadius: "6px",
                              padding: "6px",
                              cursor: (inventory.items && inventory.items.expPotions > 0) ? "pointer" : "not-allowed",
                              fontSize: "11px",
                              fontWeight: "bold",
                              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 0 #1b7a43",
                              textShadow: "1px 1px 0px rgba(0,0,0,0.4)"
                            }}
                          >
                            🧪 EXP물약 사용
                          </button>
                        )}

                        {/* Stage 2 Evolve Button */}
                        {canEvolveToStage2 && (
                          <button
                            onClick={async () => {
                              const res = await monsterService.evolveMonster(cm.id);
                              if (res.success) {
                                setMessage(res.message);
                                setTimeout(() => setMessage(null), 4000);
                                await loadData();
                              } else {
                                alert(res.message);
                              }
                            }}
                            disabled={!hasStonesForStage2}
                            style={{
                              background: hasStonesForStage2 ? "linear-gradient(180deg, #e67e22 0%, #d35400 100%)" : "#7f8c8d",
                              color: "white",
                              border: hasStonesForStage2 ? "2px solid #f1c40f" : "1px solid #7f8c8d",
                              borderRadius: "6px",
                              padding: "6px",
                              cursor: hasStonesForStage2 ? "pointer" : "not-allowed",
                              fontSize: "11px",
                              fontWeight: "900",
                              boxShadow: hasStonesForStage2 ? "inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 0 #a04000" : "none",
                              textShadow: "1px 1px 0px rgba(0,0,0,0.4)"
                            }}
                            className={hasStonesForStage2 ? "glowing-btn" : ""}
                          >
                            💎 진화 가능 (돌 1개)
                          </button>
                        )}

                        {/* Stage 3 Evolve Button */}
                        {canEvolveToStage3 && (
                          <button
                            onClick={async () => {
                              const res = await monsterService.evolveMonster(cm.id);
                              if (res.success) {
                                setMessage(res.message);
                                setTimeout(() => setMessage(null), 4000);
                                await loadData();
                              } else {
                                alert(res.message);
                              }
                            }}
                            disabled={!hasStonesForStage3}
                            style={{
                              background: hasStonesForStage3 ? "linear-gradient(180deg, #9b59b6 0%, #8e44ad 100%)" : "#7f8c8d",
                              color: "white",
                              border: hasStonesForStage3 ? "2px solid #e040fb" : "1px solid #7f8c8d",
                              borderRadius: "6px",
                              padding: "6px",
                              cursor: hasStonesForStage3 ? "pointer" : "not-allowed",
                              fontSize: "11px",
                              fontWeight: "900",
                              boxShadow: hasStonesForStage3 ? "inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 0 #5b2c6f" : "none",
                              textShadow: "1px 1px 0px rgba(0,0,0,0.4)"
                            }}
                            className={hasStonesForStage3 ? "glowing-btn" : ""}
                          >
                            💎 최종진화 (돌 2개)
                          </button>
                        )}

                        {/* Equip / Unequip Toggle */}
                        <div>
                          {userInfo.activeMonsterId === cm.id ? (
                            <button onClick={handleUnequip} style={{ 
                              background: "linear-gradient(180deg, #e74c3c 0%, #c0392b 100%)", 
                              color: "white", 
                              border: "1px solid #922b21", 
                              borderRadius: "6px", 
                              padding: "6px", 
                              cursor: "pointer", 
                              fontSize: "11px", 
                              width: "100%", 
                              fontWeight: "900",
                              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 0 #7b241c",
                              textShadow: "1px 1px 0px rgba(0,0,0,0.5)"
                            }}>
                              장착 해제
                            </button>
                          ) : (
                            <button onClick={() => handleSetActive(cm.id)} style={{ 
                              background: "linear-gradient(180deg, #3498db 0%, #2980b9 100%)", 
                              color: "white", 
                              border: "1px solid #1f618d", 
                              borderRadius: "6px", 
                              padding: "6px", 
                              cursor: "pointer", 
                              fontSize: "11px", 
                              width: "100%", 
                              fontWeight: "900",
                              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 0 #1a5276",
                              textShadow: "1px 1px 0px rgba(0,0,0,0.5)"
                            }}>
                              장착하기
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "quest" && (
          <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
            {/* Quest Sub-tabs */}
            <div style={{ display: "flex", background: "#251d38", borderRadius: "8px", padding: "4px", marginBottom: "12px", border: "2px solid #2d2440" }}>
              <button
                onClick={() => setQuestSubTab("daily")}
                style={{
                  flex: 1,
                  padding: "8px",
                  background: questSubTab === "daily" ? "#4a3b69" : "transparent",
                  color: questSubTab === "daily" ? "#f1c40f" : "#95a5a6",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                일일 퀘스트
              </button>
              <button
                onClick={() => setQuestSubTab("achievement")}
                style={{
                  flex: 1,
                  padding: "8px",
                  background: questSubTab === "achievement" ? "#4a3b69" : "transparent",
                  color: questSubTab === "achievement" ? "#f1c40f" : "#95a5a6",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                일반 업적
              </button>
            </div>

            <div style={{ 
              background: "rgba(241, 196, 15, 0.08)", 
              borderLeft: "4px solid #f1c40f", 
              padding: "6px 10px", 
              borderRadius: "4px", 
              fontSize: "11px", 
              marginBottom: "12px",
              color: "#e2e7ec",
              lineHeight: "1.4"
            }}>
              💡 보상 아이템은 <b>나의 몬스터</b> 탭에서 물약 투여 및 수동 진화에 사용하실 수 있습니다!
            </div>

            <div style={{ display: "grid", gap: "10px" }}>
              {quests
                .filter(q => q.type === questSubTab)
                .map(q => {
                  const progressPercent = Math.min(100, (q.currentCount / q.targetCount) * 100);
                  const isQuestFullyCompleted = q.completed && q.currentCount >= q.targetCount;
                  return (
                    <div key={q.id} style={{
                      background: q.claimed ? "rgba(0,0,0,0.2)" : "#2c3e50",
                      padding: "10px",
                      borderRadius: "10px",
                      border: q.claimed ? "2px solid #555" : isQuestFullyCompleted ? "2px solid #f1c40f" : "1px solid #7f8c8d",
                      boxShadow: "0 3px 5px rgba(0,0,0,0.2)",
                      opacity: q.claimed ? 0.6 : 1
                    }}>
                      <div style={{ fontWeight: "900", color: q.claimed ? "#7f8c8d" : "#fff", fontSize: "13px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>{q.title}</span>
                        {q.claimed && <span style={{ color: "#2ecc71", fontSize: "10px", fontWeight: "bold" }}>수령 완료 ✔</span>}
                      </div>
                      
                      <p style={{ margin: "4px 0 6px", fontSize: "11px", color: q.claimed ? "#555" : "#bdc3c7", lineHeight: "1.3" }}>
                        {q.description}
                      </p>

                      {!q.claimed && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                          <div style={{ flex: 1, height: "6px", background: "#1a1a24", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${progressPercent}%`, background: isQuestFullyCompleted ? "#f1c40f" : "#3498db", transition: "width 0.3s" }} />
                          </div>
                          <span style={{ fontSize: "10px", color: isQuestFullyCompleted ? "#f1c40f" : "#bdc3c7", fontWeight: "bold" }}>
                            {q.currentCount}/{q.targetCount}
                          </span>
                        </div>
                      )}

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                        <div style={{ display: "flex", gap: "4px" }}>
                          {q.reward.expPotions > 0 && (
                            <span style={{ background: "rgba(46, 204, 113, 0.1)", border: "1px solid #27ae60", borderRadius: "4px", padding: "1px 4px", fontSize: "9px", color: "#2ecc71", fontWeight: "bold" }}>
                              🧪 EXP물약 +{q.reward.expPotions}
                            </span>
                          )}
                          {q.reward.evolutionStones > 0 && (
                            <span style={{ background: "rgba(241, 196, 15, 0.1)", border: "1px solid #d35400", borderRadius: "4px", padding: "1px 4px", fontSize: "9px", color: "#f1c40f", fontWeight: "bold" }}>
                              💎 진화돌 +{q.reward.evolutionStones}
                            </span>
                          )}
                        </div>

                        {!q.claimed && (
                          <button
                            disabled={!isQuestFullyCompleted}
                            onClick={async () => {
                              const res = await questService.claimReward(q.id);
                              if (res.success) {
                                setMessage(res.message);
                                setTimeout(() => setMessage(null), 3000);
                                await loadData();
                              } else {
                                alert(res.message);
                              }
                            }}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              border: isQuestFullyCompleted ? "1px solid #f1c40f" : "1px solid #7f8c8d",
                              background: isQuestFullyCompleted ? "linear-gradient(180deg, #f1c40f 0%, #f39c12 100%)" : "#7f8c8d",
                              color: isQuestFullyCompleted ? "#000" : "#fff",
                              cursor: isQuestFullyCompleted ? "pointer" : "not-allowed",
                              fontWeight: "900",
                              fontSize: "10px",
                              boxShadow: isQuestFullyCompleted ? "0 0 6px rgba(241, 196, 15, 0.4)" : "none"
                            }}
                            className={isQuestFullyCompleted ? "glowing-btn-small" : ""}
                          >
                            보상 받기
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes glow {
          0% { box-shadow: 0 0 4px #f1c40f; }
          50% { box-shadow: 0 0 10px #f1c40f, 0 0 12px rgba(241,196,15,0.6); }
          100% { box-shadow: 0 0 4px #f1c40f; }
        }
        .glowing-btn {
          animation: glow 2s infinite ease-in-out;
        }
        .glowing-btn-small {
          animation: glow 1.5s infinite ease-in-out;
        }
        button:active {
          transform: translateY(2px);
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
}
