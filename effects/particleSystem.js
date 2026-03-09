// Shared particle utilities. Uses Babylon particle API and can be swapped to GPUParticleSystem.
export class CombatParticleSystem {
  constructor(scene) {
    this.scene = scene;
  }

  createTrail(emitter, color = new BABYLON.Color4(1, 0.5, 0.2, 1)) {
    const ps = new BABYLON.GPUParticleSystem('trail', { capacity: 600 }, this.scene);
    ps.particleTexture = new BABYLON.Texture('https://assets.babylonjs.com/textures/flare.png', this.scene);
    ps.emitter = emitter;
    ps.minEmitPower = 2;
    ps.maxEmitPower = 5;
    ps.color1 = color;
    ps.color2 = color;
    ps.emitRate = 220;
    ps.minLifeTime = 0.2;
    ps.maxLifeTime = 0.7;
    ps.start();
    return ps;
  }
}
