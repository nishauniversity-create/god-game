// Chase camera tuned for flight combat readability.
export class CameraSystem {
  constructor(scene, canvas, jet) {
    this.camera = new BABYLON.UniversalCamera('combatCam', new BABYLON.Vector3(0, 30, -70), scene);
    this.camera.fov = 0.95;
    this.camera.attachControl(canvas, true);
    this.camera.inputs.clear();
    this.jet = jet;
  }

  update() {
    const forward = this.jet.mesh.forward.scale(-70);
    const targetPos = this.jet.mesh.position.add(new BABYLON.Vector3(0, 20, 0)).add(forward);
    this.camera.position = BABYLON.Vector3.Lerp(this.camera.position, targetPos, 0.08);
    this.camera.setTarget(this.jet.mesh.position.add(this.jet.mesh.forward.scale(80)));
  }
}
