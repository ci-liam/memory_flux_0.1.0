import { Utils } from "../utils/helpers.js";
import { globalEventBus, EVENTS } from "../core/EventBus.js";
import { globalStateManager } from "../core/StateManager.js";
import { TEMPORAL_CONCEPTIONS, PLANES } from "../utils/constants.js";

export class VisualizationPlane {
  constructor({ terminal, asciiVisualizer }, options = {}) {
    this.terminal = terminal;
    this.asciiVisualizer = asciiVisualizer;
    // conception ahora es un objeto, ej: TEMPORAL_CONCEPTIONS.CIRCULAR
    this.conception = options.conception;
    this.isActive = false;
  }

  async enter() {
    this.isActive = true;
    await this.terminal.addSeparator("~", 60);
    // Usamos .name para mostrar el nombre en mayúsculas
    await this.terminal.writeLine(
      `Renderizando concepción temporal: ${this.conception.name}`,
      "section-header",
      true
    );
    await Utils.delay(1000);

    const memories = globalStateManager.getState().processedMemories;
    if (!memories || memories.length === 0) {
      await this.terminal.showMessage(
        "Anomalía: Flujo de memoria vacío.",
        "warning"
      );
      this.complete();
      return;
    }

    const vizContainer = document.createElement("div");
    this.terminal.container.appendChild(vizContainer);

    const vizData = this.prepareVisualizationData(memories);

    await this.asciiVisualizer.animateVisualization(
      vizContainer,
      this.conception,
      vizData,
      5000
    );

    await Utils.delay(1000);

    // Usamos el índice del objeto conception para encontrar el poema correcto
    const memoryToShow = memories[this.conception.index];

    if (memoryToShow && memoryToShow.transformed) {
      const poemContainer = document.createElement("div");
      this.terminal.container.appendChild(poemContainer);
      await poemContainer.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      await this.terminal.writeLine(
        memoryToShow.transformed,
        "poetic-text",
        true,
        poemContainer
      );
    }

    await Utils.delay(3500);
    vizContainer.remove();
    this.complete();
  }

  prepareVisualizationData(memories) {
    // Usamos .id para la lógica interna
    switch (this.conception.id) {
      case "circular":
        return {
          nodes: memories.map((mem, i) => ({
            angle: (360 / memories.length) * i,
          })),
        };
      case "rhizomatic":
        const nodeCount = memories.length;
        return {
          nodes: memories.map((mem) => ({})),
          connections: Array.from({ length: nodeCount * 2 }, () => ({
            from: Utils.random(0, nodeCount - 1),
            to: Utils.random(0, nodeCount - 1),
          })),
        };
      case "layered":
        return {
          layers: memories.map((mem, i) => ({
            content: mem.original,
            opacity: 1 - i / memories.length,
          })),
        };
      default:
        return {};
    }
  }

  complete() {
    this.isActive = false;
    // Usamos el ID del plano (ej: "circular") para el evento
    globalEventBus.emit(EVENTS.PLANE_COMPLETE, { planeId: this.conception.id });
  }

  exit() {
    this.isActive = false;
  }
}
