import { CombatParticleSystem } from './particleSystem.js';

// Dedicated jet exhaust controller.
export class EngineTrails {
  constructor(scene, jetMesh) {
    this.ps = new CombatParticleSystem(scene).createTrail(jetMesh, new BABYLON.Color4(0.3, 0.6, 1, 1));
  }

  setThrottleFactor(v) {
    this.ps.emitRate = 140 + v * 260;
  }
}
