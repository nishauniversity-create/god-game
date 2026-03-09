// Lightweight projectile for high-rate cannon fire.
export class Bullet {
  constructor(scene, origin, direction) {
    this.mesh = BABYLON.MeshBuilder.CreateSphere('bullet', { diameter: 0.4 }, scene);
    this.mesh.position = origin.clone();
    this.velocity = direction.normalize().scale(700);
    this.life = 2;
  }

  update(dt) {
    this.life -= dt;
    this.mesh.position.addInPlace(this.velocity.scale(dt));
  }
}
