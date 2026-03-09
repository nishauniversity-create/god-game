// Explosion VFX and shockwave pulse.
export class ExplosionSystem {
  constructor(scene) {
    this.scene = scene;
  }

  trigger(position) {
    const sphere = BABYLON.MeshBuilder.CreateSphere('shockwave', { diameter: 1 }, this.scene);
    sphere.position = position.clone();
    const mat = new BABYLON.StandardMaterial('shockMat', this.scene);
    mat.emissiveColor = new BABYLON.Color3(1, 0.5, 0.1);
    mat.alpha = 0.45;
    sphere.material = mat;

    BABYLON.Animation.CreateAndStartAnimation('scaleUp', sphere, 'scaling', 60, 18, BABYLON.Vector3.One(), new BABYLON.Vector3(45, 45, 45), 0, null, () => sphere.dispose());
  }
}
