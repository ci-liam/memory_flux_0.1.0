// src/core/StateManager.js
import { PLANES } from "../utils/constants.js";
import { globalEventBus, EVENTS } from "./EventBus.js";
import { Utils } from "../utils/helpers.js";

class StateManager {
  constructor() {
    this.state = this.getInitialState();
    this.setupEventListeners();
  }

  getInitialState() {
    return {
      currentPlane: PLANES.INTRODUCTION,
      memories: [],
      processedMemories: [],
      systemHealth: "stable",
      sessionId: Utils.generateId(),
    };
  }

  setupEventListeners() {
    globalEventBus.on(EVENTS.MEMORY_INPUT, (memoryText) => {
      this.addMemory(memoryText);
    });
  }

  setState(newState) {
    // Fusiona el estado antiguo con el nuevo
    this.state = { ...this.state, ...newState };
    Utils.log(`Estado actualizado: ${JSON.stringify(newState)}`);
  }

  getState() {
    // Devuelve una copia para evitar mutaciones accidentales
    return { ...this.state };
  }

  getStateProperty(path) {
    return path
      .split(".")
      .reduce(
        (obj, key) => (obj && obj[key] !== "undefined" ? obj[key] : undefined),
        this.state
      );
  }

  addMemory(memoryText) {
    if (!memoryText || typeof memoryText !== "string") {
      Utils.log("Intento de agregar memoria inválida", "warn");
      return;
    }
    const newMemory = {
      id: Utils.generateId(),
      text: memoryText.trim(),
      timestamp: Date.now(),
    };
    this.setState({
      memories: [...this.state.memories, newMemory],
    });
  }

  setProcessedMemories(processedData) {
    this.setState({
      processedMemories: processedData,
    });
  }

  hasMemories() {
    return this.state.memories.length > 0;
  }

  getMemoryCount() {
    return this.state.memories.length;
  }

  reset() {
    Utils.log("Reiniciando el estado global...");
    this.state = this.getInitialState();
  }
}

// única instancia global para toda la aplicación
export const globalStateManager = new StateManager();
