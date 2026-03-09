import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class JetModelSystem {
  constructor() {
    this.loader = new GLTFLoader();
    this.cache = new Map();
  }

  async loadJet(type, fallbackFactory) {
    const key = `assets/models/jets/${type}.glb`;
    if (this.cache.has(key)) return this.cache.get(key).clone(true);
    try {
      const gltf = await this.loader.loadAsync(key);
      const root = gltf.scene;
      root.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
      this.cache.set(key, root);
      return root.clone(true);
    } catch (e) {
      return fallbackFactory(type);
    }
  }
}
