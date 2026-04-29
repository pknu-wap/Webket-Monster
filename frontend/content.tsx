import type { PlasmoCSConfig } from "plasmo";
import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
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

import { monsterService, Monster } from "./services/monsterService";

export const config: PlasmoCSConfig = {
  matches: ["https://www.pknu.ac.kr/*", "https://pknu.ac.kr/*"]
};

export default function WebketMonsterOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [spawnedMonster, setSpawnedMonster] = useState<Monster | null>(null);
  const [catchMessage, setCatchMessage] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: -200, y: -200 }); // Start off-screen

  useEffect(() => {
    // Determine if a monster should spawn on page load
    const rollForSpawn = async () => {
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
        const texture = await PIXI.Assets.load(spawnedMonster.imageUrl);
        const sprite = new PIXI.Sprite(texture);
        
        sprite.width = 100;
        sprite.height = 100;
        sprite.anchor.set(0.5);
        sprite.x = app.screen.width / 2;
        sprite.y = app.screen.height / 2;
        
        sprite.eventMode = 'static';
        sprite.cursor = 'pointer';
        
        // Internal floating animation
        let elapsed = 0;
        app.ticker.add((ticker) => {
          if (isCaught) return;
          elapsed += ticker.deltaTime;
          sprite.y = (app!.screen.height / 2) + Math.sin(elapsed / 10.0) * 10;

          // Move the DOM element towards the target
          const dx = targetX - currentX;
          const dy = targetY - currentY;
          
          if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            currentX += dx * 0.01 * ticker.deltaTime; // speed
            currentY += dy * 0.01 * ticker.deltaTime;
            
            // Flip sprite depending on direction
            if (dx > 0) sprite.scale.x = Math.abs(sprite.scale.x) * -1; // Face right
            else sprite.scale.x = Math.abs(sprite.scale.x); // Face left

            setPos({ x: currentX, y: currentY });
          }
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
            sprite.rotation += 0.5 * ticker.deltaTime;
            sprite.scale.x *= 0.9;
            sprite.scale.y *= 0.9;
            
            if (Math.abs(sprite.scale.x) <= 0.01) {
              app!.destroy(true);
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

  if (!spawnedMonster) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: pos.y + "px",
        left: pos.x + "px",
        zIndex: 9999999,
        pointerEvents: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "none" // We animate manually via state
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
  );
}
