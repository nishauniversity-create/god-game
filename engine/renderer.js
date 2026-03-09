// Babylon-first renderer bootstrap with WebGPU fallback.
export class Renderer {
  constructor(target) {
    this.canvas = target instanceof HTMLCanvasElement
      ? target
      : this.#createCanvas(target);
    this.engine = null;
    this.scene = null;
    this.usingWebGPU = false;
  }

  #createCanvas(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('Renderer target must be a canvas or an HTML container element.');
    }

    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
      return existingCanvas;
    }

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.setAttribute('aria-label', 'Sky Dominion render canvas');
    container.appendChild(canvas);
    return canvas;
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
