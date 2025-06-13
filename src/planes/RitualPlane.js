import { MESSAGES, PLANES } from "../utils/constants.js";
import { Utils } from "../utils/helpers.js";
import { globalEventBus, EVENTS } from "../core/EventBus.js";

export class RitualPlane {
  constructor(terminal) {
    this.terminal = terminal;
    this.isActive = false;
  }

  async enter() {
    this.isActive = true;
    await this.terminal.addSeparator("§", 60);
    await this.terminal.writeLine(
      "RITUAL DE MEMORIA FÍSICA",
      "plane-header",
      true
    );
    await this.terminal.writeLine(
      "El sistema digital ha fallado. La memoria debe volver al mundo analógico.",
      "context",
      true
    );
    await Utils.delay(1000);

    for (const instruction of MESSAGES.RITUAL.instructions) {
      await this.terminal.writeLine(instruction, "instruction", true);
      await Utils.delay(1500);
    }

    await Utils.delay(1000);
    await this.terminal.writeLine(
      "...el ciclo se completa. La memoria es libre.",
      "success",
      true
    );
    await Utils.delay(3000); // Pausa para leer el mensaje final

    // El plano notifica que ha terminado. 
    this.complete();
  }

  complete() {
    this.isActive = false;
    globalEventBus.emit(EVENTS.PLANE_COMPLETE, { planeId: PLANES.RITUAL });
  }

  exit() {
    this.isActive = false;
  }
}
