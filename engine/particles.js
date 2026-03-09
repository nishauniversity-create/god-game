import * as THREE from 'three';

export class GpuParticleSystem {
  constructor(scene, max = 2000) {
    this.scene = scene;
    this.max = max;
    this.cursor = 0;
    this.life = new Float32Array(max);
    this.vel = new Float32Array(max * 3);
    this.geo = new THREE.BufferGeometry();
    this.pos = new Float32Array(max * 3);
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    this.points = new THREE.Points(this.geo, new THREE.PointsMaterial({ color: 0xffaa66, size: 3, transparent: true, opacity: 0.8 }));
    scene.add(this.points);
  }

  emit(position, velocity, count = 8) {
    for (let i = 0; i < count; i++) {
      const id = this.cursor++ % this.max;
      this.pos[id * 3] = position.x;
      this.pos[id * 3 + 1] = position.y;
      this.pos[id * 3 + 2] = position.z;
      this.vel[id * 3] = velocity.x + (Math.random() - 0.5) * 6;
      this.vel[id * 3 + 1] = velocity.y + (Math.random() - 0.5) * 6;
      this.vel[id * 3 + 2] = velocity.z + (Math.random() - 0.5) * 6;
      this.life[id] = 1;
    }
    this.geo.attributes.position.needsUpdate = true;
  }

  update(dt) {
    for (let i = 0; i < this.max; i++) {
      if (this.life[i] <= 0) continue;
      this.life[i] -= dt;
      this.pos[i * 3] += this.vel[i * 3] * dt;
      this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt;
      this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
    }
    this.geo.attributes.position.needsUpdate = true;
  }
}
