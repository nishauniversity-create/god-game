// Babylon-first renderer bootstrap with WebGPU fallback.
export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.engine = null;
    this.scene = null;
    this.usingWebGPU = false;
  }

  async initialize() {
    if (BABYLON.WebGPUEngine?.IsSupportedAsync && await BABYLON.WebGPUEngine.IsSupportedAsync) {
      this.engine = new BABYLON.WebGPUEngine(this.canvas, { antialias: true });
      await this.engine.initAsync();
      this.usingWebGPU = true;
    } else {
      this.engine = new BABYLON.Engine(this.canvas, true, { stencil: true, adaptToDeviceRatio: true });
    }
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0.01, 0.02, 0.05, 1);
    this.scene.environmentIntensity = 1.2;
    return this.scene;
  }
}
