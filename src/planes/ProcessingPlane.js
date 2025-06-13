import { Utils } from "../utils/helpers.js";
import { globalEventBus, EVENTS } from "../core/EventBus.js";
import { globalStateManager } from "../core/StateManager.js";
import { PLANES } from "../utils/constants.js";

export class ProcessingPlane {
  constructor(terminal, poeticAPI) {
    this.terminal = terminal;
    this.poeticAPI = poeticAPI;
    this.isActive = false;
  }

  async enter() {
    this.isActive = true;
    const memories = globalStateManager.getState().memories;

    await this.terminal.addSeparator("~", 60);
    await this.terminal.writeLine(
      "Iniciando análisis poético del flujo de memoria...",
      "section-header",
      true
    );

    const progressBar = Utils.createProgressBar(40);
    const progressLine = await this.terminal.writeLine(
      "",
      "progress-line",
      false
    );
    progressBar.create(progressLine);

    const processedResults = [];
    for (let i = 0; i < memories.length; i++) {
      const memory = memories[i];
      // Mostramos el procesamiento individual
      const line = await this.terminal.writeLine(
        ` > Analizando: "${memory.text.substring(0, 30)}..."`,
        "processing-step"
      );

      const result = await this.poeticAPI.processMemory(memory.text);
      processedResults.push(result);

      // Actualizamos la barra de progreso después de cada memoria
      await progressBar.update(((i + 1) / memories.length) * 100);
      line.textContent = `   ✓ Recuerdo ${i + 1} transformado.`;
      await Utils.delay(800);
    }

    globalStateManager.setProcessedMemories(processedResults);

    await this.terminal.showMessage(
      "Análisis completado. Las memorias han sido liberadas de su forma original.",
      "success",
      true
    );
    await Utils.delay(2000);

    this.complete();
  }

  complete() {
    this.isActive = false;
    globalEventBus.emit(EVENTS.PLANE_COMPLETE, { planeId: PLANES.PROCESSING });
  }

  exit() {
    this.isActive = false;
  }
}
