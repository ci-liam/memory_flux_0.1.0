import { MemoryFlux } from "./core/MemoryFlux.js";
import { Utils } from "./utils/helpers.js";

export class MemoryFluxApp {
  constructor() {
    this.memoryFlux = null;
  }

  async init() {
    try {
      this.memoryFlux = new MemoryFlux("memory-flux-container");
      await this.memoryFlux.initialize();
      await this.memoryFlux.start();
    } catch (error) {
      this.showErrorScreen(error);
    }
  }

  showErrorScreen(error) {
    const container =
      document.getElementById("memory-flux-container") || document.body;
    container.innerHTML = `<div style="color:red;padding:20px;font-family:monospace;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;"><h2>ERROR CRÍTICO</h2><pre>${error.stack}</pre></div>`;
  }
}
