import { useEffect, useState } from "react";
import { monsterService, UserInfo, Inventory, Monster, getEvolvedMonsterData } from "./services/monsterService";

export default function IndexPopup() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [activeTab, setActiveTab] = useState<"info" | "inventory">("info");

  useEffect(() => {
    const loadData = async () => {
      setUserInfo(await monsterService.getUserInfo());
      setInventory(await monsterService.getInventory());
      setMonsters(await monsterService.getMonsterList());
    };
    loadData();
  }, []);

  const handleSetActive = async (caughtMonsterId: string) => {
    await monsterService.setActiveMonster(caughtMonsterId);
    setUserInfo(await monsterService.getUserInfo());
  };

  const handleUnequip = async () => {
    await monsterService.setActiveMonster(null);
    setUserInfo(await monsterService.getUserInfo());
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
      minHeight: 450,
      fontFamily: "'NeoDunggeunmo', 'Jua', 'Nanum Gothic', sans-serif",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#1a1a24",
      backgroundImage: "linear-gradient(to bottom, #1a1a24 0%, #2b2b36 100%)",
      color: "#ffffff",
      userSelect: "none"
    }}>
      {/* Header */}
      <div style={{ 
        padding: "16px", 
        backgroundColor: "#4a3b69", 
        borderBottom: "4px solid #2d2440",
        boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
        textAlign: "center",
        position: "relative"
      }}>
        <h1 style={{ margin: 0, fontSize: "22px", color: "#f1c40f", textShadow: "2px 2px 0px #e67e22, 0 0 10px rgba(241,196,15,0.5)", fontWeight: "900", letterSpacing: "1px" }}>
          웹켓 몬스터
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#ecf0f1", fontWeight: "bold" }}>
          Lv.1 트레이너 <span style={{ color: "#3498db" }}>{userInfo.nickname}</span>님
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "4px solid #2d2440", backgroundColor: "#34294a" }}>
        <button
          onClick={() => setActiveTab("info")}
          style={{
            flex: 1,
            padding: "12px",
            background: activeTab === "info" ? "#4a3b69" : "transparent",
            border: "none",
            borderRight: "2px solid #2d2440",
            color: activeTab === "info" ? "#f1c40f" : "#95a5a6",
            cursor: "pointer",
            fontWeight: "900",
            fontSize: "15px",
            transition: "all 0.2s"
          }}
        >
          트레이너 정보
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          style={{
            flex: 1,
            padding: "12px",
            background: activeTab === "inventory" ? "#4a3b69" : "transparent",
            border: "none",
            borderLeft: "2px solid #2d2440",
            color: activeTab === "inventory" ? "#f1c40f" : "#95a5a6",
            cursor: "pointer",
            fontWeight: "900",
            fontSize: "15px",
            transition: "all 0.2s"
          }}
        >
          나의 몬스터
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
                const activeEvolvedData = getEvolvedMonsterData(activeBaseData, activeCm.level);
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {inventory.caughtMonsters.map(cm => {
                  const mBaseData = getMonsterData(cm.monsterId);
                  if (!mBaseData) return null;
                  
                  const mData = getEvolvedMonsterData(mBaseData, cm.level);
                  const requiredExp = mBaseData.baseExpToNextLevel * cm.level;
                  const expPercent = cm.level >= 5 ? 100 : Math.min(100, (cm.exp / requiredExp) * 100);
                  const isMaxLevel = cm.level >= 5;

                  return (
                    <div key={cm.id} style={{ 
                      background: "linear-gradient(180deg, #34495e 0%, #2c3e50 100%)", 
                      padding: "12px", 
                      borderRadius: "12px", 
                      textAlign: "center",
                      border: "2px solid #7f8c8d",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
                      position: "relative"
                    }}>
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

                      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "50%", padding: "8px", marginBottom: "8px", display: "inline-block" }}>
                        <img src={mData.imageUrl} alt={mData.name} style={{ width: 56, height: 56, filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.4))" }} />
                      </div>
                      
                      <div style={{ fontWeight: "900", fontSize: "14px", color: "#fff", textShadow: "1px 1px 1px #000", marginBottom: "8px" }}>
                        {mData.name}
                      </div>
                      
                      {/* EXP Bar */}
                      {!isMaxLevel ? (
                        <>
                          <div style={{ height: "8px", background: "#1a1a24", borderRadius: "4px", overflow: "hidden", border: "1px solid #7f8c8d" }}>
                            <div style={{ height: "100%", width: `${expPercent}%`, background: "linear-gradient(90deg, #3498db 0%, #2ecc71 100%)", transition: "width 0.3s" }} />
                          </div>
                          <div style={{ fontSize: "10px", color: "#bdc3c7", marginTop: "4px", fontWeight: "bold" }}>EXP {cm.exp} / {requiredExp}</div>
                        </>
                      ) : (
                        <div style={{ fontSize: "11px", color: "#f1c40f", fontWeight: "bold", padding: "4px 0", textShadow: "0 0 5px rgba(241,196,15,0.5)" }}>
                          진화 마스터!
                        </div>
                      )}
                      
                      <div style={{ marginTop: "12px" }}>
                        {userInfo.activeMonsterId === cm.id ? (
                          <button onClick={handleUnequip} style={{ 
                            background: "linear-gradient(180deg, #e74c3c 0%, #c0392b 100%)", 
                            color: "white", 
                            border: "1px solid #922b21", 
                            borderRadius: "6px", 
                            padding: "8px", 
                            cursor: "pointer", 
                            fontSize: "13px", 
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
                            padding: "8px", 
                            cursor: "pointer", 
                            fontSize: "13px", 
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
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        button:active {
          transform: translateY(2px);
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
}
