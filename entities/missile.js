// Homing missile entity used by player and AI.
export class Missile {
  constructor(scene, origin, target) {
    this.mesh = BABYLON.MeshBuilder.CreateCylinder('missile', { height: 3, diameter: 0.5 }, scene);
    this.mesh.position = origin.clone();
    this.speed = 260;
    this.life = 8;
    this.target = target;
  }

  update(dt) {
    this.life -= dt;
    if (this.target?.mesh) {
      const toTarget = this.target.mesh.position.subtract(this.mesh.position).normalize();
      const desiredDir = BABYLON.Vector3.Lerp(this.mesh.forward, toTarget, 0.1).normalize();
      this.mesh.lookAt(this.mesh.position.add(desiredDir));
    }
    this.mesh.position.addInPlace(this.mesh.forward.scale(this.speed * dt));
  }
}
