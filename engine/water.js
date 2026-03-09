import * as THREE from 'three';
import { Water } from 'three/addons/objects/Water.js';

export class OceanSystem {
  constructor(scene) {
    this.scene = scene;
    this.water = null;
  }

  init() {
    const geo = new THREE.PlaneGeometry(24000, 24000);
    this.water = new Water(geo, {
      textureWidth: 256,
      textureHeight: 256,
      waterColor: 0x1d3b5a,
      sunColor: 0xffffff,
      distortionScale: 1.6,
      fog: true
    });
    this.water.rotation.x = -Math.PI / 2;
    this.water.position.y = -25;
    this.scene.add(this.water);
  }

  update(dt) {
    if (this.water?.material?.uniforms?.time) this.water.material.uniforms.time.value += dt;
  }
}
