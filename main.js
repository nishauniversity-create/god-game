import * as THREE from 'three';
import { Renderer } from './engine/renderer.js';
import { SceneManager } from './engine/sceneManager.js';
import { CameraSystem } from './engine/cameraSystem.js';
import { LightingSystem } from './engine/lightingSystem.js';
import { Jet } from './entities/jet.js';
import { Drone } from './entities/drone.js';
import { Missile } from './entities/missile.js';
import { Bullet } from './entities/bullet.js';
import { TerrainSystem } from './environment/terrainSystem.js';
import { BuildingSystem } from './environment/buildingSystem.js';
import { VegetationSystem } from './environment/vegetationSystem.js';
import { ExplosionSystem } from './effects/explosionSystem.js';
import { EngineTrails } from './effects/engineTrails.js';
import { PhysicsWorld } from './physics/physicsWorld.js';
import { CollisionSystem } from './physics/collisionSystem.js';

const canvas = document.getElementById('canvas-container');
const hud = document.getElementById('hud');
hud.style.display = 'block';
document.getElementById('menu').style.display = 'none';

const renderer = new Renderer(canvas);
const scene = await renderer.initialize();
const manager = new SceneManager(scene);
new LightingSystem(scene);

const jet = new Jet(scene);
const camera = manager.addSystem(new CameraSystem(scene, canvas, jet));
const terrain = manager.addSystem(new TerrainSystem(scene));
new BuildingSystem(scene);
new VegetationSystem(scene);
const explosions = new ExplosionSystem(scene);
const trails = new EngineTrails(scene, jet.mesh);

const physics = new PhysicsWorld(scene);
await physics.initialize();

const drones = Array.from({ length: 20 }, (_, i) => new Drone(scene, i));
const missiles = [];
const bullets = [];

// Three.js stays helper-only: utility vectors/math for aiming.
const tmpVec = new THREE.Vector3();

const input = { pitch: 0, yaw: 0, roll: 0, throttle: 0, fire: false };
window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyW') input.pitch = -1;
  if (e.code === 'KeyS') input.pitch = 1;
  if (e.code === 'KeyA') input.yaw = -1;
  if (e.code === 'KeyD') input.yaw = 1;
  if (e.code === 'KeyQ') input.roll = -1;
  if (e.code === 'KeyE') input.roll = 1;
  if (e.code === 'ShiftLeft') input.throttle = 1;
  if (e.code === 'Space') input.fire = true;
  if (e.code === 'KeyM' && jet.missiles > 0) {
    jet.missiles--;
    missiles.push(new Missile(scene, jet.mesh.position.add(jet.mesh.forward.scale(8)), drones[0]));
  }
});
window.addEventListener('keyup', (e) => {
  if (['KeyW', 'KeyS'].includes(e.code)) input.pitch = 0;
  if (['KeyA', 'KeyD'].includes(e.code)) input.yaw = 0;
  if (['KeyQ', 'KeyE'].includes(e.code)) input.roll = 0;
  if (e.code === 'ShiftLeft') input.throttle = 0;
  if (e.code === 'Space') input.fire = false;
});

canvas.addEventListener('pointerdown', () => {
  bullets.push(new Bullet(scene, jet.mesh.position.add(jet.mesh.forward.scale(7)), jet.mesh.forward));
});

document.getElementById('btn-missile')?.addEventListener('click', () => {
  if (jet.missiles > 0) {
    jet.missiles--;
    missiles.push(new Missile(scene, jet.mesh.position.add(jet.mesh.forward.scale(8)), drones[0]));
  }
});

document.getElementById('btn-boost')?.addEventListener('touchstart', () => { input.throttle = 1; });
document.getElementById('btn-boost')?.addEventListener('touchend', () => { input.throttle = 0; });

scene.createDefaultEnvironment({ createGround: false, createSkybox: false });
const pipeline = new BABYLON.DefaultRenderingPipeline('pipe', true, scene, [camera.camera]);
pipeline.bloomEnabled = true;
pipeline.bloomWeight = 0.4;
pipeline.fxaaEnabled = true;

let last = performance.now();
renderer.engine.runRenderLoop(() => {
  const now = performance.now();
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;

  jet.update(dt, input);
  trails.setThrottleFactor(input.throttle > 0 ? 1 : 0.4);
  terrain.update(jet.mesh.position);
  camera.update();

  for (const drone of drones) drone.update(dt, jet.mesh.position);
  for (const missile of missiles) missile.update(dt);
  for (const bullet of bullets) bullet.update(dt);

  for (const missile of missiles) {
    for (const drone of drones) {
      if (drone.hp > 0 && CollisionSystem.hit(missile.mesh, drone.mesh, 10)) {
        drone.hp = 0;
        drone.mesh.isVisible = false;
        explosions.trigger(drone.mesh.position);
        missile.life = 0;
      }
    }
  }
  for (const bullet of bullets) {
    for (const drone of drones) {
      tmpVec.set(drone.mesh.position.x - bullet.mesh.position.x, drone.mesh.position.y - bullet.mesh.position.y, drone.mesh.position.z - bullet.mesh.position.z);
      if (drone.hp > 0 && tmpVec.length() < 8) {
        drone.hp -= 25;
        if (drone.hp <= 0) {
          drone.mesh.isVisible = false;
          explosions.trigger(drone.mesh.position);
        }
        bullet.life = 0;
      }
    }
  }

  for (const list of [missiles, bullets]) {
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].life <= 0) {
        list[i].mesh.dispose();
        list.splice(i, 1);
      }
    }
  }

  document.getElementById('speed-gauge').textContent = `SPD ${jet.speed.toFixed(0)}`;
  document.getElementById('alt-gauge').textContent = `ALT ${jet.mesh.position.y.toFixed(0)}m`;
  document.getElementById('missile-count').textContent = `MISSILES: ${jet.missiles}`;
  document.getElementById('enemy-tracker').textContent = `HOSTILES: ${drones.filter((d) => d.hp > 0).length}`;
  const hp = `${Math.max(0, jet.health)}%`;
  document.getElementById('health-fill').style.width = hp;

  scene.render();
});
window.addEventListener('resize', () => renderer.engine.resize());
