import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export class AdvancedLightingSystem {
  constructor(renderer, scene) {
    this.renderer = renderer;
    this.scene = scene;
    this.pmrem = new THREE.PMREMGenerator(renderer);
  }

  init() {
    this.renderer.physicallyCorrectLights = true;
    const envTex = this.pmrem.fromScene(new RoomEnvironment(this.renderer), 0.04).texture;
    this.scene.environment = envTex;
  }
}
