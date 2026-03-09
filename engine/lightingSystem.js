// Cinematic lighting stack: sun + ambient + volumetric + shadows.
export class LightingSystem {
  constructor(scene) {
    this.sun = new BABYLON.DirectionalLight('sun', new BABYLON.Vector3(-0.35, -0.9, 0.2), scene);
    this.sun.intensity = 3.0;
    this.sun.position = new BABYLON.Vector3(800, 1200, -400);

    this.hemi = new BABYLON.HemisphericLight('ambient', new BABYLON.Vector3(0, 1, 0), scene);
    this.hemi.intensity = 0.35;

    this.shadow = new BABYLON.ShadowGenerator(2048, this.sun, true);
    this.shadow.usePercentageCloserFiltering = true;
    this.shadow.filteringQuality = BABYLON.ShadowGenerator.QUALITY_HIGH;

    const sky = BABYLON.MeshBuilder.CreateBox('sky', { size: 12000 }, scene);
    const skyMat = new BABYLON.PBRMaterial('skyMat', scene);
    skyMat.backFaceCulling = false;
    skyMat.unlit = true;
    skyMat.albedoColor = new BABYLON.Color3(0.04, 0.08, 0.18);
    sky.material = skyMat;

    scene.imageProcessingConfiguration.toneMappingEnabled = true;
    scene.imageProcessingConfiguration.exposure = 1.1;
  }
}
