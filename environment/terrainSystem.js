import * as THREE from 'three';

// Chunked procedural terrain with Three noise helpers and Babylon mesh output.
export class TerrainSystem {
  constructor(scene) {
    this.scene = scene;
    this.chunkSize = 400;
    this.radius = 2;
    this.chunks = new Map();
  }

  noise(x, z) {
    return (Math.sin(x * 0.005) + Math.cos(z * 0.006) + Math.sin((x + z) * 0.0015)) * 0.33;
  }

  height(x, z) {
    const ridge = Math.abs(this.noise(x * 1.6, z * 1.2));
    const valley = Math.sin(x * 0.0009) * Math.cos(z * 0.0009) * 80;
    return ridge * 180 + valley;
  }

  buildChunk(cx, cz, lod = 32) {
    const key = `${cx},${cz}`;
    if (this.chunks.has(key)) return;

    const ground = BABYLON.MeshBuilder.CreateGround(`terrain-${key}`, {
      width: this.chunkSize,
      height: this.chunkSize,
      subdivisions: lod
    }, this.scene);
    ground.position.x = cx * this.chunkSize;
    ground.position.z = cz * this.chunkSize;

    const positions = ground.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] = this.height(positions[i] + ground.position.x, positions[i + 2] + ground.position.z);
    }
    ground.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
    ground.convertToFlatShadedMesh();

    const mat = new BABYLON.PBRMaterial(`terrainMat-${key}`, this.scene);
    mat.albedoColor = new BABYLON.Color3(0.24, 0.33, 0.2);
    mat.metallic = 0;
    mat.roughness = 1;
    ground.material = mat;
    this.chunks.set(key, ground);
  }

  update(jetPos) {
    const cx = Math.floor(jetPos.x / this.chunkSize);
    const cz = Math.floor(jetPos.z / this.chunkSize);
    const keep = new Set();
    for (let x = -this.radius; x <= this.radius; x++) {
      for (let z = -this.radius; z <= this.radius; z++) {
        const key = `${cx + x},${cz + z}`;
        keep.add(key);
        this.buildChunk(cx + x, cz + z, Math.abs(x) + Math.abs(z) > 2 ? 16 : 32);
      }
    }
    for (const [key, mesh] of this.chunks.entries()) {
      if (!keep.has(key)) {
        mesh.dispose();
        this.chunks.delete(key);
      }
    }
  }
}
