import { globalEventBus, EVENTS } from "../core/EventBus.js";
import { Utils } from "../utils/helpers.js";
import { PLANES } from "../utils/constants.js";

export class CorruptionPlane {
  constructor(terminal, glitchEffects) {
    this.terminal = terminal;
    this.glitchEffects = glitchEffects;
    this.isActive = false;
  }

  async enter() {
    this.isActive = true;
    await this.terminal.addSeparator("!", 60);
    const line1 = await this.terminal.writeLine(
      "ADVERTENCIA: Integridad del flujo de datos comprometida.",
      "error",
      true
    );

    // Inicia un glitch caótico en la línea de advertencia
    this.glitchEffects.startChaoticGlitch(line1, { duration: 4000 });

    // Activa el efecto de scanlines en toda la pantalla
    this.glitchEffects.toggleScanlines(this.terminal.container, true);

    await Utils.delay(2000);

    const line2 = await this.terminal.writeLine(
      "...los recuerdos se desvanecen, se reescriben...",
      "context",
      true
    );
    this.glitchEffects.startChaoticGlitch(line2, { duration: 2000 });

    await Utils.delay(2500);

    // Desactiva los efectos antes de pasar al siguiente plano
    this.glitchEffects.toggleScanlines(this.terminal.container, false);
    this.glitchEffects.stopAllEffects();

    this.complete();
  }

  complete() {
    this.isActive = false;
    globalEventBus.emit(EVENTS.PLANE_COMPLETE, { planeId: PLANES.CORRUPTION });
  }

  exit() {
    this.isActive = false;
    // Asegurarse de que todos los efectos se detengan al salir del plano
    this.glitchEffects.stopAllEffects();
    this.glitchEffects.toggleScanlines(this.terminal.container, false);
  }
}
