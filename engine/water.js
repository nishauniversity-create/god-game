import * as THREE from 'three';
import { Water } from 'three/addons/objects/Water.js';

export class OceanSystem {
  constructor(scene) {
    this.scene = scene;
    this.water = null;
  }

  _createFallbackNormalTexture(size = 128) {
    // Water shader expects a normal map; create a tiny procedural fallback so startup never fails.
    const data = new Uint8Array(size * size * 4);
    for (let i = 0; i < size * size; i++) {
      data[i * 4] = 128;
      data[i * 4 + 1] = 128;
      data[i * 4 + 2] = 255;
      data[i * 4 + 3] = 255;
    }
    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.needsUpdate = true;
    return tex;
  }

  init() {
    const geo = new THREE.PlaneGeometry(24000, 24000);
    this.water = new Water(geo, {
      textureWidth: 256,
      textureHeight: 256,
      waterNormals: this._createFallbackNormalTexture(),
      sunDirection: new THREE.Vector3(0.3, 0.8, 0.2).normalize(),
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
