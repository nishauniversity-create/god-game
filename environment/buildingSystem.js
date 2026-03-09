// Instanced metropolitan blocks for scale and performance.
export class BuildingSystem {
  constructor(scene) {
    this.scene = scene;
    const base = BABYLON.MeshBuilder.CreateBox('buildingPrototype', { size: 1 }, scene);
    const material = new BABYLON.PBRMaterial('buildingMat', scene);
    material.albedoColor = new BABYLON.Color3(0.3, 0.32, 0.35);
    material.metallic = 0.6;
    material.roughness = 0.5;
    base.material = material;

    this.instances = [];
    for (let i = 0; i < 250; i++) {
      const h = 15 + Math.random() * 120;
      const inst = base.createInstance(`b-${i}`);
      inst.scaling = new BABYLON.Vector3(20 + Math.random() * 35, h, 20 + Math.random() * 35);
      inst.position = new BABYLON.Vector3((Math.random() - 0.5) * 5000, h / 2, (Math.random() - 0.5) * 5000);
      this.instances.push(inst);
    }
    base.isVisible = false;
  }
}
