import * as THREE from 'three';

// Procedural chunked terrain with distance-based LOD and shader-based texture blending.
export class ProceduralTerrainSystem {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.options = {
      chunkSize: 420,
      viewRadius: 2,
      baseResolution: 56,
      maxHeight: 180,
      seed: 1337,
      ...options
    };
    this.chunks = new Map();
    this.group = new THREE.Group();
    this.group.name = 'terrain-chunks';
    this.scene.add(this.group);
  }

  _noise2(x, z) {
    const s = this.options.seed;
    return (Math.sin((x + s) * 12.9898 + (z - s) * 78.233) * 43758.5453) % 1;
  }

  _fbm(x, z) {
    let v = 0; let a = 0.5; let f = 0.003;
    for (let i = 0; i < 5; i++) {
      v += a * (this._noise2(x * f, z * f) * 2 - 1);
      f *= 2;
      a *= 0.5;
    }
    return v;
  }

  _height(x, z) {
    const ridge = 1 - Math.abs(this._fbm(x * 1.2, z * 1.2));
    const mountain = Math.max(0, this._fbm(x * 0.45, z * 0.45));
    const valley = -Math.abs(this._fbm(x * 0.9 + 100, z * 0.9 - 100));
    const erosion = this._fbm(x * 2.2 + 50, z * 2.2 - 25) * 0.1;
    return (ridge * 0.35 + mountain * 0.65 + valley * 0.22 + erosion) * this.options.maxHeight;
  }

  _createMaterial() {
    return new THREE.MeshStandardMaterial({
      roughness: 0.95,
      metalness: 0.02,
      color: 0xffffff,
      onBeforeCompile: (shader) => {
        shader.vertexShader = shader.vertexShader.replace(
          '#include <common>',
          '#include <common>\nvarying float vAltitude;'
        ).replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\nvAltitude = transformed.y;'
        );
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <common>',
          '#include <common>\nvarying float vAltitude;'
        ).replace(
          'vec4 diffuseColor = vec4( diffuse, opacity );',
          `
          float grass = smoothstep(-20.0, 35.0, vAltitude) * (1.0 - smoothstep(80.0, 120.0, vAltitude));
          float rock = smoothstep(35.0, 130.0, vAltitude);
          float snow = smoothstep(120.0, 190.0, vAltitude);
          vec3 grassCol = vec3(0.15, 0.26, 0.10);
          vec3 rockCol = vec3(0.34, 0.34, 0.36);
          vec3 snowCol = vec3(0.84, 0.88, 0.93);
          vec3 terrainCol = mix(grassCol, rockCol, rock);
          terrainCol = mix(terrainCol, snowCol, snow);
          vec4 diffuseColor = vec4(terrainCol * (0.75 + grass * 0.25), opacity);
          `
        );
      }
    });
  }

  _buildChunk(cx, cz, lod = 0) {
    const key = `${cx},${cz}`;
    if (this.chunks.has(key)) return;
    const res = Math.max(16, this.options.baseResolution >> lod);
    const geo = new THREE.PlaneGeometry(this.options.chunkSize, this.options.chunkSize, res, res);
    geo.rotateX(-Math.PI / 2);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) + cx * this.options.chunkSize;
      const z = p.getZ(i) + cz * this.options.chunkSize;
      p.setY(i, this._height(x, z));
    }
    geo.computeVertexNormals();

    const mesh = new THREE.Mesh(geo, this._createMaterial());
    mesh.receiveShadow = true;
    mesh.position.set(cx * this.options.chunkSize, 0, cz * this.options.chunkSize);
    mesh.frustumCulled = true;
    this.group.add(mesh);
    this.chunks.set(key, mesh);
  }

  update(playerPosition) {
    const cs = this.options.chunkSize;
    const pcx = Math.floor(playerPosition.x / cs);
    const pcz = Math.floor(playerPosition.z / cs);
    const keep = new Set();

    for (let x = -this.options.viewRadius; x <= this.options.viewRadius; x++) {
      for (let z = -this.options.viewRadius; z <= this.options.viewRadius; z++) {
        const cx = pcx + x;
        const cz = pcz + z;
        const d = Math.max(Math.abs(x), Math.abs(z));
        const lod = d >= 2 ? 2 : d >= 1 ? 1 : 0;
        const key = `${cx},${cz}`;
        keep.add(key);
        this._buildChunk(cx, cz, lod);
      }
    }

    for (const [key, mesh] of this.chunks) {
      if (!keep.has(key)) {
        this.group.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
        this.chunks.delete(key);
      }
    }
  }
}
