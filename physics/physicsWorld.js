// Ammo.js physics bootstrap with Babylon plugin integration.
export class PhysicsWorld {
  constructor(scene) {
    this.scene = scene;
    this.ready = false;
  }

  async initialize() {
    if (!window.Ammo) return;
    const ammo = await window.Ammo();
    const plugin = new BABYLON.AmmoJSPlugin(true, ammo);
    this.scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), plugin);
    this.ready = true;
  }
}
