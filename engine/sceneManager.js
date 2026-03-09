// Central scene orchestrator. Keeps system ordering explicit for future extensions.
export class SceneManager {
  constructor(scene) {
    this.scene = scene;
    this.systems = [];
  }

  addSystem(system) {
    this.systems.push(system);
    return system;
  }

  update(dt, gameState) {
    for (const system of this.systems) {
      if (system?.update) system.update(dt, gameState);
    }
  }
}
