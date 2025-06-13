import { MESSAGES } from "../utils/constants.js";
import { Utils } from "../utils/helpers.js";
import { globalEventBus, EVENTS } from "../core/EventBus.js";
import { globalStateManager } from "../core/StateManager.js";

export class InputPlane {
  constructor(terminal, options = {}) {
    this.terminal = terminal;
    this.planeId = options.planeId || "input_default";
    this.questionIndex = options.questionIndex || 0;
    this.isActive = false;
  }

  async enter() {
    this.isActive = true;
    await this.terminal.addSeparator("═", 60);
    const question =
      MESSAGES.INPUTS[this.questionIndex] || "¿Algo más que desees liberar?";

    await this.terminal.writeLine(question, "question", true);
    await Utils.delay(500);

    const userInput = await this.terminal.showPrompt(
      `recuerdo_${this.questionIndex + 1}>`
    );

    if (userInput && userInput.trim() !== "") {
      globalStateManager.addMemory(userInput);
      await this.terminal.showMessage(
        "...recuerdo capturado y encriptado en el flujo.",
        "warning"
      );
    } else {
      await this.terminal.showMessage(
        "El silencio también es una forma de memoria. Procesando...",
        "warning"
      );
      globalStateManager.addMemory("[silencio]");
    }

    await Utils.delay(1000);
    this.complete();
  }

  complete() {
    this.isActive = false;
    globalEventBus.emit(EVENTS.PLANE_COMPLETE, { planeId: this.planeId });
  }

  exit() {
    this.isActive = false;
  }
}
