import { Utils } from "../utils/helpers.js";
import { globalEventBus, EVENTS } from "./EventBus.js";
import { globalStateManager } from "./StateManager.js";
import { Terminal } from "../components/Terminal.js";
import { AsciiVisualizer } from "../components/AsciiVisualizer.js";
import { GlitchEffects } from "../components/GlitchEffects.js";
import { PoeticAPI } from "../utils/api.js";
import { PlaneManager } from "../planes/PlaneManager.js";

export class MemoryFlux {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Contenedor con ID '${containerId}' no encontrado`);
    }
    this.isInitialized = false;
    this.isRunning = false;
    this.terminal = null;
    this.planeManager = null;
  }

  async initialize() {
    if (this.isInitialized) return;
    Utils.log("Inicializando MemoryFlux...");

    this.container.innerHTML = "";

    this.terminal = new Terminal(this.container);
    const asciiVisualizer = new AsciiVisualizer();
    const glitchEffects = new GlitchEffects();
    const poeticAPI = new PoeticAPI();

    this.planeManager = new PlaneManager({
      terminal: this.terminal,
      asciiVisualizer,
      glitchEffects,
      poeticAPI,
    });

    this.setupGlobalEventListeners();

    this.isInitialized = true;
    Utils.log("MemoryFlux inicializado correctamente.");
    globalEventBus.emit(EVENTS.SYSTEM_INIT);
  }

  setupGlobalEventListeners() {
    // Usamos una función de flecha para que se refiera a la instancia de MemoryFlux
    globalEventBus.on(EVENTS.SYSTEM_ERROR, (error) => {
      this.handleSystemError(error.message || "Error desconocido");
    });

    
    // El listener ahora usa 'this.terminal' y 'this.restart()' directamente.
    globalEventBus.on(EVENTS.SYSTEM_COMPLETE, () => {
      this.terminal
        .showPrompt("[Presiona ENTER para reiniciar el ciclo]")
        .then(() => {
          this.restart();
        });
    });
  }

  handleSystemError(errorMessage) {
    this.terminal.showMessage(`ERROR DEL SISTEMA: ${errorMessage}`, "error");
  }

  async start() {
    if (!this.isInitialized)
      throw new Error("MemoryFlux debe ser inicializado antes de ejecutarse.");
    if (this.isRunning) return;

    this.isRunning = true;
    globalEventBus.emit(EVENTS.SYSTEM_READY);
    await this.planeManager.start();
  }

  async restart() {
    Utils.log("Reiniciando MemoryFlux...");
    this.isRunning = false;
    globalStateManager.reset();
    this.terminal.clear();
    await this.start();
  }
}
