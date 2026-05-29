import type { PlasmoCSConfig } from "plasmo";
import { useEffect, useRef, useState } from "react";
import { Storage } from "@plasmohq/storage";
import * as PIXI from "pixi.js";

// Force Parcel to statically bundle PixiJS environments/renderers to prevent dynamic import errors ('blpiu')
import "pixi.js/lib/environment-browser/browserAll.mjs";
import "pixi.js/lib/rendering/renderers/gl/WebGLRenderer.mjs";
import "pixi.js/lib/rendering/renderers/canvas/CanvasRenderer.mjs";
import "pixi.js/lib/rendering/renderers/gpu/WebGPURenderer.mjs";

import { generateUniformsSyncPolyfill } from "pixi.js/lib/unsafe-eval/uniforms/generateUniformsSyncPolyfill.mjs";
import { generateUboSyncPolyfillSTD40, generateUboSyncPolyfillWGSL } from "pixi.js/lib/unsafe-eval/ubo/generateUboSyncPolyfill.mjs";
import { generateShaderSyncPolyfill } from "pixi.js/lib/unsafe-eval/shader/generateShaderSyncPolyfill.mjs";
import { generateParticleUpdatePolyfill } from "pixi.js/lib/unsafe-eval/particle/generateParticleUpdatePolyfill.mjs";

(PIXI.AbstractRenderer as any).prototype._unsafeEvalCheck = () => {};
(PIXI.UboSystem as any).prototype._systemCheck = () => {};
(PIXI.GlUniformGroupSystem as any).prototype._generateUniformsSync = generateUniformsSyncPolyfill;
(PIXI.GlUboSystem as any).prototype._generateUboSync = generateUboSyncPolyfillSTD40;
(PIXI.GpuUboSystem as any).prototype._generateUboSync = generateUboSyncPolyfillWGSL;
(PIXI.GlShaderSystem as any).prototype._generateShaderSync = generateShaderSyncPolyfill;
if (PIXI.ParticleBuffer) (PIXI.ParticleBuffer as any).prototype.generateParticleUpdate = generateParticleUpdatePolyfill;

import { monsterService, Monster, getEvolvedMonsterData } from "./services/monsterService";
import { questService } from "./services/questService";

export const config: PlasmoCSConfig = {
  matches: ["*://*.pknu.ac.kr/*"]
};

export default function WebketMonsterOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeContainerRef = useRef<HTMLDivElement>(null);
  const [spawnedMonster, setSpawnedMonster] = useState<Monster | null>(null);
  const [catchMessage, setCatchMessage] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: -200, y: -200 }); // Start off-screen
  const [activeMonsterInfo, setActiveMonsterInfo] = useState<{ 
    id: string; 
    name: string; 
    imageUrl: string;
    spritesheetUrl1?: string;
    spritesheetUrl2?: string;
  } | null>(null);
  const [activeMonsterLevel, setActiveMonsterLevel] = useState<number>(0);

  useEffect(() => {
    const storage = new Storage();

    const loadActiveMonster = async () => {
      const userInfo = await monsterService.getUserInfo();
      if (userInfo.activeMonsterId && userInfo.showActiveMonster !== false) {
        const inventory = await monsterService.getInventory();
        const activeCm = inventory.caughtMonsters.find(cm => cm.id === userInfo.activeMonsterId);
        if (activeCm) {
          const monsters = await monsterService.getMonsterList();
          const mData = monsters.find(m => m.id === activeCm.monsterId);
          if (mData) {
            const evolvedInfo = getEvolvedMonsterData(mData, activeCm.evolutionStage || 1);
            setActiveMonsterInfo(prev => 
              (prev?.id === mData.id && prev?.imageUrl === evolvedInfo.imageUrl && prev?.spritesheetUrl1 === evolvedInfo.spritesheetUrl1) 
                ? prev 
                : { 
                    id: mData.id, 
                    name: evolvedInfo.name, 
                    imageUrl: evolvedInfo.imageUrl,
                    spritesheetUrl1: evolvedInfo.spritesheetUrl1,
                    spritesheetUrl2: evolvedInfo.spritesheetUrl2
                  }
            );
            setActiveMonsterLevel(activeCm.level);
          } else {
            setActiveMonsterInfo(null);
            setActiveMonsterLevel(0);
          }
        } else {
          setActiveMonsterInfo(null);
          setActiveMonsterLevel(0);
        }
      } else {
        setActiveMonsterInfo(null);
        setActiveMonsterLevel(0);
      }
    };

    loadActiveMonster();

    storage.watch({
      "userInfo": () => {
        loadActiveMonster();
      }
    });
  }, []);

  useEffect(() => {
    // Record page visit quest progress when on PKNU site
    if (window.location.hostname.includes("pknu.ac.kr")) {
      questService.incrementProgress("visit", 1).catch(e => console.error("Quest update error:", e));
    }
  }, []);

  useEffect(() => {
    // Determine if a monster should spawn on page load
    const rollForSpawn = async () => {
      if (!window.location.hostname.includes("pknu.ac.kr")) return;
      
      const userInfo = await monsterService.getUserInfo();
      if (userInfo.spawnWildMonsters === false) return;
      
      const monsters = await monsterService.getMonsterList();
      for (const monster of monsters.sort(() => Math.random() - 0.5)) {
        if (Math.random() < monster.probability) {
          setSpawnedMonster(monster);
          
          // Set initial random position within window bounds
          setPos({
            x: Math.max(10, Math.floor(Math.random() * (window.innerWidth - 150))),
            y: Math.max(10, Math.floor(Math.random() * (window.innerHeight - 150)))
          });
          break;
        }
      }
    };
    
    rollForSpawn();
  }, []);

  useEffect(() => {
    if (!spawnedMonster || !containerRef.current) return;

    let app: PIXI.Application | null = null;
    let isCaught = false;

    // Wandering logic variables
    let currentX = pos.x;
    let currentY = pos.y;
    let targetX = currentX;
    let targetY = currentY;
    let wanderTimer: ReturnType<typeof setInterval>;

    const initPixi = async () => {
      app = new PIXI.Application();
      await app.init({
        width: 150,
        height: 150,
        backgroundAlpha: 0,
      });
      
      if (!containerRef.current) return;
      containerRef.current.appendChild(app.canvas);

      try {
        const texture = await PIXI.Assets.load(spawnedMonster.spritesheetUrl1 || spawnedMonster.imageUrl);
        
        let idleFrames: PIXI.Texture[] = [texture];
        let walkFrames: PIXI.Texture[] = [texture];
        let hasSpritesheet = !!spawnedMonster.spritesheetUrl1;

        if (hasSpritesheet) {
          const spriteSheetColumns = 4;
          const spriteSheetRows = 4;
          const frameWidth = texture.width / spriteSheetColumns;
          const frameHeight = texture.height / spriteSheetRows;
          
          idleFrames = Array.from({length: 4}, (_, i) => new PIXI.Texture({
            source: texture.source,
            frame: new PIXI.Rectangle(i * frameWidth, 0 * frameHeight, frameWidth, frameHeight)
          }));
          
          walkFrames = Array.from({length: 4}, (_, i) => new PIXI.Texture({
            source: texture.source,
            frame: new PIXI.Rectangle(i * frameWidth, 1 * frameHeight, frameWidth, frameHeight)
          }));
        }

        const sprite = new PIXI.Sprite(idleFrames[0]);
        
        sprite.width = 100;
        sprite.height = 100;
        sprite.anchor.set(0.5);
        sprite.x = app.screen.width / 2;
        sprite.y = app.screen.height / 2;
        
        sprite.eventMode = 'static';
        sprite.cursor = 'pointer';
        
        // Internal floating and walking animation
        let elapsed = 0;
        let animationElapsed = 0;
        app.ticker.add((ticker) => {
          if (isCaught) return;
          elapsed += ticker.deltaTime;
          animationElapsed += ticker.deltaTime;

          // Move the DOM element towards the target
          const dx = targetX - currentX;
          const dy = targetY - currentY;
          let isMoving = false;
          
          if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            currentX += dx * 0.01 * ticker.deltaTime; // speed
            currentY += dy * 0.01 * ticker.deltaTime;
            isMoving = true;
            
            // Flip sprite depending on direction
            if (dx > 0) sprite.scale.x = Math.abs(sprite.scale.x) * -1; // Face right
            else sprite.scale.x = Math.abs(sprite.scale.x); // Face left

            setPos({ x: currentX, y: currentY });
          }

          if (hasSpritesheet) {
            const currentFrames = isMoving ? walkFrames : idleFrames;
            const frameIndex = Math.floor(animationElapsed / 8) % currentFrames.length;
            sprite.texture = currentFrames[frameIndex];
          }

          sprite.y = (app!.screen.height / 2) + Math.sin(elapsed / 10.0) * 10;
        });

        // Pick a new target position every 2-4 seconds
        wanderTimer = setInterval(() => {
          if (isCaught) return;
          targetX = Math.max(10, Math.floor(Math.random() * (window.innerWidth - 150)));
          targetY = Math.max(10, Math.floor(Math.random() * (window.innerHeight - 150)));
        }, 3000);

        sprite.on('pointerdown', async () => {
          if (isCaught) return;
          isCaught = true;
          clearInterval(wanderTimer);
          
          app!.ticker.add((ticker) => {
            if (!sprite.visible) return;
            sprite.rotation += 0.5 * ticker.deltaTime;
            sprite.scale.x *= 0.9;
            sprite.scale.y *= 0.9;
            
            if (Math.abs(sprite.scale.x) <= 0.01) {
              sprite.visible = false;
            }
          });

          const result = await monsterService.catchMonster(spawnedMonster.id);
          setCatchMessage(result.message);
          
          setTimeout(() => {
            setSpawnedMonster(null);
            setCatchMessage(null);
          }, 3000);
        });

        app.stage.addChild(sprite);
      } catch (err) {
        console.error("Failed to load monster texture:", err);
      }
    };

    initPixi();

    return () => {
      clearInterval(wanderTimer);
      if (app) app.destroy(true);
    };
  }, [spawnedMonster]);

  useEffect(() => {
    if (!activeMonsterInfo || !activeContainerRef.current) return;

    let app = new PIXI.Application();
    let isDestroyed = false;
    const storage = new Storage();
    let unwatch: (() => void) | null = null;

    const initActivePixi = async () => {
      await app.init({
        width: 150,
        height: 150,
        backgroundAlpha: 0,
      });
      
      if (isDestroyed || !activeContainerRef.current) return;
      activeContainerRef.current.innerHTML = "";
      activeContainerRef.current.appendChild(app.canvas);

      try {
        // Load Sheet 1
        const texture1 = await PIXI.Assets.load(activeMonsterInfo.spritesheetUrl1 || activeMonsterInfo.imageUrl);
        const spriteSheetColumns = 4;
        const spriteSheetRows = 4;
        const frameWidth1 = texture1.width / spriteSheetColumns;
        const frameHeight1 = texture1.height / spriteSheetRows;
        
        let idleFrames = [texture1];
        let walkFrames = [texture1];
        let happyFrames = [texture1];
        let hungryFrames = [texture1];
        let hasSpritesheet = !!activeMonsterInfo.spritesheetUrl1;

        if (hasSpritesheet) {
          // Parse Sheet 1 rows
          idleFrames = Array.from({length: 4}, (_, i) => new PIXI.Texture({
            source: texture1.source,
            frame: new PIXI.Rectangle(i * frameWidth1, 0 * frameHeight1, frameWidth1, frameHeight1)
          }));
          walkFrames = Array.from({length: 4}, (_, i) => new PIXI.Texture({
            source: texture1.source,
            frame: new PIXI.Rectangle(i * frameWidth1, 1 * frameHeight1, frameWidth1, frameHeight1)
          }));
          happyFrames = Array.from({length: 4}, (_, i) => new PIXI.Texture({
            source: texture1.source,
            frame: new PIXI.Rectangle(i * frameWidth1, 2 * frameHeight1, frameWidth1, frameHeight1)
          }));
          hungryFrames = Array.from({length: 4}, (_, i) => new PIXI.Texture({
            source: texture1.source,
            frame: new PIXI.Rectangle(i * frameWidth1, 3 * frameHeight1, frameWidth1, frameHeight1)
          }));
        }

        // Load Sheet 2 (Actions 1 & 2) if stage >= 2 (Level >= 3) and sheet 2 is present
        let action1Frames = happyFrames;
        let action2Frames = happyFrames;
        let hasSheet2 = !!activeMonsterInfo.spritesheetUrl2;

        if (hasSheet2 && activeMonsterLevel >= 3) {
          try {
            const texture2 = await PIXI.Assets.load(activeMonsterInfo.spritesheetUrl2!);
            const frameWidth2 = texture2.width / spriteSheetColumns;
            const frameHeight2 = texture2.height / spriteSheetRows;
            
            action1Frames = Array.from({length: 4}, (_, i) => new PIXI.Texture({
              source: texture2.source,
              frame: new PIXI.Rectangle(i * frameWidth2, 0 * frameHeight2, frameWidth2, frameHeight2)
            }));
            action2Frames = Array.from({length: 4}, (_, i) => new PIXI.Texture({
              source: texture2.source,
              frame: new PIXI.Rectangle(i * frameWidth2, 1 * frameHeight2, frameWidth2, frameHeight2)
            }));
          } catch (e) {
            console.error("Failed to load spritesheet 2:", e);
          }
        }

        const sprite = new PIXI.Sprite(idleFrames[0]);
        
        sprite.width = 100;
        sprite.height = 100;
        sprite.anchor.set(0.5);
        sprite.x = app.screen.width / 2;
        sprite.y = app.screen.height / 2;

        app.stage.addChild(sprite);

        // State machine variables
        type MonsterState = "idle" | "walk" | "happy" | "hungry" | "action1" | "action2";
        let currentState: MonsterState = "idle";
        let elapsed = 0;
        let animationElapsed = 0;
        let loopCounter = 0;

        const setAnimationState = (newState: MonsterState) => {
          if (currentState === newState) return;
          currentState = newState;
          animationElapsed = 0;
          loopCounter = 0;
        };

        // App animation ticker
        app.ticker.add((ticker) => {
          elapsed += ticker.deltaTime;
          animationElapsed += ticker.deltaTime;

          // Compute frame out of 4
          const subFrameIndex = Math.floor(animationElapsed / 8) % 4;

          // Loop tracking
          if (Math.floor(animationElapsed / 8) >= 4) {
            animationElapsed = 0;
            loopCounter += 1;

            // Revert temporary states after 3 loops
            if (currentState === "happy" || currentState === "action1" || currentState === "action2") {
              if (loopCounter >= 3) {
                setAnimationState("idle");
              }
            }
          }

          if (hasSpritesheet) {
            let currentFrames = idleFrames;
            if (currentState === "walk") currentFrames = walkFrames;
            else if (currentState === "happy") currentFrames = happyFrames;
            else if (currentState === "hungry") currentFrames = hungryFrames;
            else if (currentState === "action1") currentFrames = action1Frames;
            else if (currentState === "action2") currentFrames = action2Frames;

            const frame = currentFrames[subFrameIndex] || currentFrames[0];
            sprite.texture = frame;
          }

          // Floating animation
          sprite.y = (app.screen.height / 2) + Math.sin(elapsed / 10.0) * 10;
        });

        // Register storage watcher to trigger states
        const handleTrigger = (trigger: string) => {
          if (trigger === "hungry") {
            setAnimationState("hungry");
          } else if (trigger === "feed") {
            if (currentState === "hungry") {
              setAnimationState("happy");
            } else {
              setAnimationState("happy");
            }
          } else if (trigger === "action1") {
            if (activeMonsterLevel >= 3) {
              setAnimationState("action1");
            }
          } else if (trigger === "action2") {
            if (activeMonsterLevel >= 3) {
              setAnimationState("action2");
            }
          }
        };

        unwatch = storage.watch({
          "activeMonsterTrigger": (change) => {
            if (change.newValue) {
              handleTrigger(change.newValue);
              storage.set("activeMonsterTrigger", null);
            }
          }
        });

      } catch (err) {
        console.error("Failed to load active monster texture:", err);
      }
    };

    initActivePixi();

    return () => {
      isDestroyed = true;
      if (unwatch) unwatch();
      if (app) app.destroy(true);
    };
  }, [activeMonsterInfo, activeMonsterLevel]);

  if (!spawnedMonster && !activeMonsterInfo) return null;

  return (
    <>
      {spawnedMonster && (
        <div
          key="spawned-monster-container"
          style={{
            position: "fixed",
            top: pos.y + "px",
            left: pos.x + "px",
            zIndex: 9999999,
            pointerEvents: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transition: "none"
          }}
        >
          {catchMessage && (
            <div style={{
              background: "rgba(0,0,0,0.8)",
              color: "white",
              padding: "8px 16px",
              borderRadius: "20px",
              marginBottom: "10px",
              fontWeight: "bold",
              fontSize: "14px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
              whiteSpace: "nowrap"
            }}>
              {catchMessage}
            </div>
          )}
          <div ref={containerRef} />
        </div>
      )}

      {activeMonsterInfo && (
        <div
          key="active-monster-container"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 9999998,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{
            background: "rgba(0,0,0,0.6)",
            color: "white",
            padding: "6px 14px",
            borderRadius: "16px",
            marginBottom: "-10px", // Pull it closer to the monster
            fontWeight: "bold",
            fontSize: "13px",
            pointerEvents: "auto",
            zIndex: 1,
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <span style={{ color: "#4caf50" }}>Lv.{activeMonsterLevel}</span>
            <span>{activeMonsterInfo.name}</span>
          </div>
          <div ref={activeContainerRef} />
        </div>
      )}
    </>
  );
}
