import * as THREE from 'three';

export class AtmosphereSystem {
  constructor(scene) {
    this.scene = scene;
    this.time = 0;
    this.clouds = null;
  }

  init() {
    const g = new THREE.BufferGeometry();
    const count = 300;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 6000;
      arr[i * 3 + 1] = 500 + Math.random() * 600;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6000;
    }
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    const m = new THREE.PointsMaterial({ color: 0xffffff, size: 45, transparent: true, opacity: 0.32, depthWrite: false });
    this.clouds = new THREE.Points(g, m);
    this.scene.add(this.clouds);
  }

  update(dt) {
    if (!this.clouds) return;
    this.time += dt;
    this.clouds.position.x = Math.sin(this.time * 0.02) * 120;
  }
}
