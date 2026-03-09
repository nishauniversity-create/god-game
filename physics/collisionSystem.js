// Collision checks separated from entities to keep gameplay logic deterministic.
export class CollisionSystem {
  static hit(a, b, radius = 4) {
    return BABYLON.Vector3.Distance(a.position, b.position) < radius;
  }
}
