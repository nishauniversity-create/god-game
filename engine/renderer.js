export class RenderDebugPanel {
  constructor(renderer) {
    this.renderer = renderer;
    this.el = document.createElement('div');
    this.el.style.cssText = 'position:absolute;left:12px;bottom:12px;padding:8px 10px;background:rgba(0,0,0,.45);color:#9df;font:12px monospace;z-index:20;pointer-events:none;';
    document.body.appendChild(this.el);
    this.acc = 0;
    this.frames = 0;
    this.fps = 0;
  }
  update(dt) {
    this.acc += dt; this.frames++;
    if (this.acc > 0.5) {
      this.fps = Math.round(this.frames / this.acc);
      this.acc = 0; this.frames = 0;
      const i = this.renderer.info;
      this.el.textContent = `FPS ${this.fps} | Draw ${i.render.calls} | Tris ${i.render.triangles}`;
    }
  }
}
