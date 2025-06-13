// src/planes/IntroductionPlane.js
import { MESSAGES, PLANES } from "../utils/constants.js";
import { Utils } from "../utils/helpers.js";
import { globalEventBus, EVENTS } from "../core/EventBus.js";

export class IntroductionPlane {
  constructor(terminal) {
    if (!terminal) {
      throw new Error(
        "IntroductionPlane: No se proporcionó una instancia de terminal válida"
      );
    }
    this.terminal = terminal;
  }

  async enter() {
    try {
      this.terminal.clear();
      await this.showIntroduction();
      await this.waitForUserInteraction();
      this.complete();
    } catch (error) {
      console.error("Error en IntroductionPlane.enter():", error);
      throw error;
    }
  }

  async showIntroduction() {
    console.log("Iniciando showIntroduction...");

    const titleArt = `
  ███╗   ███╗███████╗███╗   ███╗ ██████╗ ██████╗ ██╗   ██╗
  ████╗ ████║██╔════╝████╗ ████║██╔═══██╗██╔══██╗╚██╗ ██╔╝
  ██╔████╔██║█████╗  ██╔████╔██║██║   ██║██████╔╝ ╚████╔╝ 
  ██║╚██╔╝██║██╔══╝  ██║╚██╔╝██║██║   ██║██╔══██╗  ╚██╔╝  
  ██║ ╚═╝ ██║███████╗██║ ╚═╝ ██║╚██████╔╝██║  ██║   ██║   
  ╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   

      ███████╗██╗     ██╗   ██╗██╗  ██╗
      ██╔════╝██║     ██║   ██║╚██╗██╔╝
      █████╗  ██║     ██║   ██║ ╚███╔╝ 
      ██╔══╝  ██║     ██║   ██║ ██╔██╗ 
      ██║     ███████╗╚██████╔╝██╔╝ ██╗
      ╚═╝     ╚══════╝ ╚═════╝ ╚═╝  ╚═╝
    `;

    try {
      await this.terminal.writeLine(titleArt, "ascii-art", false);
      await this.terminal.writeLine(
        MESSAGES.INTRODUCTION.subtitle,
        "subtitle",
        true
      );
    } catch (error) {
      console.error("Error en showIntroduction:", error);
      throw error;
    }
  }

  async waitForUserInteraction() {
    console.log("💡 Iniciando waitForUserInteraction...");

    // Mostrar el mensaje
    await this.terminal.writeLine(
      "[Haz clic AQUÍ o presiona cualquier tecla para continuar]",
      "continue-prompt",
      true
    );

    // Crear una promesa que se resuelve con CUALQUIER interacción
    return new Promise((resolve) => {
      console.log("🎯 Configurando listeners...");

      let resolved = false;

      const resolveOnce = (source) => {
        if (resolved) return;
        resolved = true;
        console.log(`✅ Resolviendo desde: ${source}`);

        // Limpiar todos los listeners
        document.removeEventListener("keydown", keyHandler);
        document.removeEventListener("click", clickHandler);
        document.removeEventListener("touchstart", touchHandler);

        resolve();
      };

      // Handler para teclado
      const keyHandler = (event) => {
        console.log(`🔥 Tecla detectada: ${event.key}`);
        event.preventDefault();
        resolveOnce("keyboard");
      };

      // Handler para clicks
      const clickHandler = (event) => {
        console.log("🖱️ Click detectado");
        event.preventDefault();
        resolveOnce("click");
      };

      // Handler para touch (móviles)
      const touchHandler = (event) => {
        console.log("👆 Touch detectado");
        event.preventDefault();
        resolveOnce("touch");
      };

      // Agregar listeners a todo el documento
      document.addEventListener("keydown", keyHandler);
      document.addEventListener("click", clickHandler);
      document.addEventListener("touchstart", touchHandler);

      console.log("👂 Esperando interacción del usuario...");

      // Auto-continuar después de 10 segundos como backup
      setTimeout(() => {
        if (!resolved) {
          console.log("⏰ Auto-continuando después de 10 segundos...");
          resolveOnce("timeout");
        }
      }, 10000);
    });
  }

  complete() {
    console.log("🎉 IntroductionPlane completado!");
    try {
      globalEventBus.emit(EVENTS.PLANE_COMPLETE, {
        planeId: PLANES.INTRODUCTION,
      });
    } catch (error) {
      console.error("Error al completar IntroductionPlane:", error);
      throw error;
    }
  }
}
