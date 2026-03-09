// Forest coverage with hardware instances for mobile/desktop scalability.
export class VegetationSystem {
  constructor(scene) {
    const trunk = BABYLON.MeshBuilder.CreateCylinder('treeTrunk', { height: 8, diameterTop: 0.8, diameterBottom: 1.2 }, scene);
    const crown = BABYLON.MeshBuilder.CreateSphere('treeCrown', { diameter: 6 }, scene);
    crown.position.y = 6;
    crown.parent = trunk;

    trunk.material = new BABYLON.StandardMaterial('trunkMat', scene);
    trunk.material.diffuseColor = new BABYLON.Color3(0.28, 0.18, 0.09);
    crown.material = new BABYLON.StandardMaterial('leafMat', scene);
    crown.material.diffuseColor = new BABYLON.Color3(0.1, 0.35, 0.14);

    this.trees = [];
    for (let i = 0; i < 600; i++) {
      const t = trunk.createInstance(`tree-${i}`);
      t.position = new BABYLON.Vector3((Math.random() - 0.5) * 6000, 4, (Math.random() - 0.5) * 6000);
      this.trees.push(t);
    }
    trunk.isVisible = false;
  }
}
