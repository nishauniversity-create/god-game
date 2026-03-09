import * as THREE from 'three';

// Manages world streaming callbacks for terrain + objects.
export class WorldChunkManager {
  constructor({ chunkSize = 420, range = 2, onChunkEnter, onChunkLeave } = {}) {
    this.chunkSize = chunkSize;
    this.range = range;
    this.onChunkEnter = onChunkEnter;
    this.onChunkLeave = onChunkLeave;
    this.loaded = new Set();
    this._v = new THREE.Vector2();
  }

  update(playerPosition) {
    const cx = Math.floor(playerPosition.x / this.chunkSize);
    const cz = Math.floor(playerPosition.z / this.chunkSize);
    const next = new Set();

    for (let x = -this.range; x <= this.range; x++) {
      for (let z = -this.range; z <= this.range; z++) {
        const key = `${cx + x},${cz + z}`;
        next.add(key);
        if (!this.loaded.has(key) && this.onChunkEnter) this.onChunkEnter(cx + x, cz + z);
      }
    }

    for (const key of this.loaded) {
      if (!next.has(key) && this.onChunkLeave) {
        const [x, z] = key.split(',').map(Number);
        this.onChunkLeave(x, z);
      }
    }
    this.loaded = next;
  }
}
