// Hostile drone AI behavior with simple seek/flee loop.
export class Drone {
  constructor(scene, idx) {
    this.mesh = BABYLON.MeshBuilder.CreateSphere(`drone-${idx}`, { diameter: 5 }, scene);
    this.mesh.position = new BABYLON.Vector3((Math.random() - 0.5) * 2000, 90 + Math.random() * 120, (Math.random() - 0.5) * 2000);
    this.hp = 50;
    this.velocity = BABYLON.Vector3.Zero();
  }

  update(dt, jetPos) {
    const toJet = jetPos.subtract(this.mesh.position);
    const desired = toJet.normalize().scale(80);
    this.velocity = BABYLON.Vector3.Lerp(this.velocity, desired, 0.04);
    this.mesh.position.addInPlace(this.velocity.scale(dt));
    this.mesh.lookAt(jetPos);
  }
}
