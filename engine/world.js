import * as THREE from 'three';

export class InstancedWorldObjects {
  constructor(scene, { maxInstances = 4000 } = {}) {
    this.scene = scene;
    this.maxInstances = maxInstances;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.cursor = 0;
    this.chunkMap = new Map();

    this.treeMesh = this._createInstanced(new THREE.ConeGeometry(8, 24, 6), new THREE.MeshStandardMaterial({ color: 0x335f22 }), maxInstances);
    this.rockMesh = this._createInstanced(new THREE.DodecahedronGeometry(5, 0), new THREE.MeshStandardMaterial({ color: 0x686868, roughness: 1 }), maxInstances);
    this.buildingMesh = this._createInstanced(new THREE.BoxGeometry(20, 90, 20), new THREE.MeshStandardMaterial({ color: 0x2f3440, emissive: 0x111111 }), Math.floor(maxInstances * 0.4));
  }

  _createInstanced(geo, mat, count) {
    const m = new THREE.InstancedMesh(geo, mat, count);
    m.count = 0;
    m.castShadow = true;
    m.receiveShadow = true;
    this.group.add(m);
    return m;
  }

  _hash(n) { return Math.abs(Math.sin(n * 12.9898) * 43758.5453) % 1; }

  spawnChunk(cx, cz, chunkSize, heightFn) {
    const key = `${cx},${cz}`;
    if (this.chunkMap.has(key)) return;
    const created = [];
    const d = new THREE.Object3D();

    for (let i = 0; i < 20; i++) {
      const rx = (this._hash(cx * 997 + cz * 131 + i) - 0.5) * chunkSize;
      const rz = (this._hash(cx * 733 + cz * 191 + i * 3) - 0.5) * chunkSize;
      const wx = cx * chunkSize + rx;
      const wz = cz * chunkSize + rz;
      const y = heightFn(wx, wz);

      d.position.set(wx, y + 12, wz);
      d.scale.setScalar(0.8 + this._hash(i * 17) * 1.6);
      d.updateMatrix();
      const id = this.treeMesh.count++;
      this.treeMesh.setMatrixAt(id, d.matrix);
      created.push(['tree', id]);

      if (i % 3 === 0 && this.rockMesh.count < this.maxInstances) {
        d.position.set(wx + 12, y + 3, wz - 8);
        d.scale.setScalar(0.7 + this._hash(i * 9) * 1.2);
        d.updateMatrix();
        const rid = this.rockMesh.count++;
        this.rockMesh.setMatrixAt(rid, d.matrix);
        created.push(['rock', rid]);
      }

      if (i % 5 === 0 && this.buildingMesh.count < this.buildingMesh.instanceMatrix.count) {
        d.position.set(wx + 25, y + 45, wz + 20);
        d.scale.set(1.1, 0.7 + this._hash(i * 23), 1.1);
        d.updateMatrix();
        const bid = this.buildingMesh.count++;
        this.buildingMesh.setMatrixAt(bid, d.matrix);
        created.push(['building', bid]);
      }
    }

    this.treeMesh.instanceMatrix.needsUpdate = true;
    this.rockMesh.instanceMatrix.needsUpdate = true;
    this.buildingMesh.instanceMatrix.needsUpdate = true;
    this.chunkMap.set(key, created);
  }

  despawnChunk(cx, cz) {
    // Keep pooled objects alive for perf; we only stop growing per chunk registration.
    this.chunkMap.delete(`${cx},${cz}`);
  }
}
