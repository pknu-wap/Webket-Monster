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
            <h2 style={{ fontSize: "16px", marginTop: 0, color: "#fff" }}>Trainer Stats</h2>
            <div style={{ background: "#2a2a40", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>
              <p style={{ margin: "0 0 8px" }}>Total Caught: <strong>{userInfo.totalCaught}</strong></p>
              <p style={{ margin: 0 }}>Unique Species: <strong>{inventory.caughtMonsters.length} / {monsters.length}</strong></p>
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
