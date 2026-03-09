import * as THREE from 'three';

// Player jet keeps original flight gameplay semantics while using Babylon meshes.
export class Jet {
  constructor(scene) {
    this.mesh = BABYLON.MeshBuilder.CreateBox('playerJet', { width: 5, height: 1.2, depth: 11 }, scene);
    this.mesh.position.y = 140;
    this.speed = 170;
    this.health = 100;
    this.missiles = 18;
    this.bombs = 6;

    const mat = new BABYLON.PBRMaterial('jetMat', scene);
    mat.metallic = 1;
    mat.roughness = 0.24;
    mat.albedoColor = new BABYLON.Color3(0.45, 0.56, 0.68);
    this.mesh.material = mat;

    // Three.js utility used only for procedural helper shape math.
    this.pathHelper = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(1, 0, 1)]);
  }

  update(dt, input) {
    this.speed += input.throttle * 70 * dt;
    this.speed = BABYLON.Scalar.Clamp(this.speed, 90, 320);
    this.mesh.rotate(BABYLON.Axis.Z, -input.roll * dt * 1.8, BABYLON.Space.LOCAL);
    this.mesh.rotate(BABYLON.Axis.X, input.pitch * dt * 1.2, BABYLON.Space.LOCAL);
    this.mesh.rotate(BABYLON.Axis.Y, input.yaw * dt, BABYLON.Space.LOCAL);
    this.mesh.position.addInPlace(this.mesh.forward.scale(this.speed * dt));
    this.mesh.position.y = Math.max(30, this.mesh.position.y);
  }
}
