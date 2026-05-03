import { useEffect, useState } from "react";
import { monsterService, UserInfo, Inventory, Monster } from "./services/monsterService";

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
    return <div style={{ padding: 16 }}>Loading...</div>;
  }

  const getMonsterData = (id: string) => monsters.find(m => m.id === id);

  return (
    <div style={{
      width: 320,
      minHeight: 400,
      fontFamily: "system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#1e1e2f",
      color: "#e0e0e0"
    }}>
      <div style={{ padding: "16px", backgroundColor: "#2a2a40", textAlign: "center", borderBottom: "2px solid #4caf50" }}>
        <h1 style={{ margin: 0, fontSize: "20px", color: "#4caf50" }}>Webket-Monster</h1>
        <p style={{ margin: "4px 0 0", fontSize: "14px" }}>Welcome, {userInfo.nickname}!</p>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid #333" }}>
        <button
          onClick={() => setActiveTab("info")}
          style={{
            flex: 1,
            padding: "12px",
            background: activeTab === "info" ? "#3a3a50" : "transparent",
            border: "none",
            color: activeTab === "info" ? "#fff" : "#888",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          My Info
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          style={{
            flex: 1,
            padding: "12px",
            background: activeTab === "inventory" ? "#3a3a50" : "transparent",
            border: "none",
            color: activeTab === "inventory" ? "#fff" : "#888",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Inventory
        </button>
      </div>

      <div style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
        {activeTab === "info" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h2 style={{ fontSize: "16px", margin: 0, color: "#fff" }}>Active Monster</h2>
              {userInfo.activeMonsterId && (
                <label style={{ display: "flex", alignItems: "center", cursor: "pointer", fontSize: "12px", color: "#ccc" }}>
                  <input
                    type="checkbox"
                    checked={userInfo.showActiveMonster !== false}
                    onChange={async (e) => {
                      await monsterService.toggleActiveMonsterDisplay(e.target.checked);
                      setUserInfo(await monsterService.getUserInfo());
                    }}
                    style={{ marginRight: "6px" }}
                  />
                  Show on Screen
                </label>
              )}
            </div>
            <div style={{ background: "#2a2a40", padding: "12px", borderRadius: "8px", marginBottom: "16px", display: "flex", alignItems: "center" }}>
              {userInfo.activeMonsterId ? (() => {
                const activeCm = inventory.caughtMonsters.find(cm => cm.id === userInfo.activeMonsterId);
                const activeData = activeCm ? getMonsterData(activeCm.monsterId) : null;
                if (!activeCm || !activeData) return <span style={{ color: "#aaa", fontSize: "14px" }}>Active monster data not found.</span>;
                return (
                  <>
                    <img src={activeData.imageUrl} alt={activeData.name} style={{ width: 48, height: 48, marginRight: "12px" }} />
                    <div>
                      <div style={{ fontWeight: "bold" }}>{activeData.name}</div>
                      <div style={{ fontSize: "12px", color: "#4caf50", marginTop: "4px" }}>Lv.{activeCm.level}</div>
                    </div>
                  </>
                );
              })() : (
                <span style={{ color: "#aaa", fontSize: "14px" }}>No active monster equipped.</span>
              )}
            </div>

            <h2 style={{ fontSize: "16px", marginTop: 0, color: "#fff" }}>Trainer Stats</h2>
            <div style={{ background: "#2a2a40", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>
              <p style={{ margin: "0 0 8px" }}>Total Caught: <strong>{userInfo.totalCaught}</strong></p>
              <p style={{ margin: 0 }}>Unique Species: <strong>{inventory.caughtMonsters.length} / {monsters.length}</strong></p>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h2 style={{ fontSize: "16px", margin: 0, color: "#fff" }}>Wild Encounters</h2>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer", fontSize: "12px", color: "#ccc" }}>
                <input
                  type="checkbox"
                  checked={userInfo.spawnWildMonsters !== false}
                  onChange={async (e) => {
                    await monsterService.toggleWildMonsterSpawn(e.target.checked);
                    setUserInfo(await monsterService.getUserInfo());
                  }}
                  style={{ marginRight: "6px" }}
                />
                Enable Spawns
              </label>
            </div>
            <div style={{ background: "#2a2a40", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>
              <p style={{ margin: 0, color: "#aaa", fontSize: "12px" }}>Allow wild monsters to appear randomly on supported web pages.</p>
            </div>

            <h2 style={{ fontSize: "16px", marginTop: 0, color: "#fff" }}>Available Species</h2>
            <div style={{ display: "grid", gap: "8px" }}>
              {monsters.map(m => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", background: "#2a2a40", padding: "8px", borderRadius: "8px" }}>
                  <img src={m.imageUrl} alt={m.name} style={{ width: 32, height: 32, marginRight: "12px" }} />
                  <div>
                    <div style={{ fontWeight: "bold" }}>{m.name}</div>
                    <div style={{ fontSize: "12px", color: "#aaa" }}>Spawn Rate: {m.probability * 100}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "inventory" && (
          <div>
            <h2 style={{ fontSize: "16px", marginTop: 0, color: "#fff" }}>My Monsters</h2>
            {inventory.caughtMonsters.length === 0 ? (
              <p style={{ color: "#aaa", textAlign: "center", marginTop: "40px" }}>No monsters caught yet.<br/>Go browse the web to find some!</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {inventory.caughtMonsters.map(cm => {
                  const mData = getMonsterData(cm.monsterId);
                  if (!mData) return null;
                  
                  const requiredExp = mData.baseExpToNextLevel * cm.level;
                  const expPercent = cm.level >= 5 ? 100 : Math.min(100, (cm.exp / requiredExp) * 100);

                  return (
                    <div key={cm.id} style={{ background: "#2a2a40", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                      <img src={mData.imageUrl} alt={mData.name} style={{ width: 48, height: 48, marginBottom: "8px" }} />
                      <div style={{ fontWeight: "bold", fontSize: "14px" }}>{mData.name}</div>
                      <div style={{ fontSize: "12px", color: "#4caf50", marginBottom: "4px" }}>Lv.{cm.level} {cm.level >= 5 ? "(MAX)" : ""}</div>
                      
                      {cm.level < 5 && (
                        <div style={{ height: "4px", background: "#1e1e2f", borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${expPercent}%`, background: "#4caf50" }} />
                        </div>
                      )}
                      {cm.level < 5 && <div style={{ fontSize: "10px", color: "#888", marginTop: "2px" }}>EXP {cm.exp}/{requiredExp}</div>}
                      
                      <div style={{ marginTop: "8px" }}>
                        {userInfo.activeMonsterId === cm.id ? (
                          <button onClick={handleUnequip} style={{ background: "#f44336", color: "white", border: "none", borderRadius: "4px", padding: "6px", cursor: "pointer", fontSize: "12px", width: "100%", fontWeight: "bold" }}>Unequip</button>
                        ) : (
                          <button onClick={() => handleSetActive(cm.id)} style={{ background: "#4caf50", color: "white", border: "none", borderRadius: "4px", padding: "6px", cursor: "pointer", fontSize: "12px", width: "100%", fontWeight: "bold" }}>Equip</button>
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
    </div>
  );
}
