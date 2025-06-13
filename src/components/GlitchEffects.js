import { Utils } from "../utils/helpers.js";
import { COLORS } from "../utils/constants.js";

export class GlitchEffects {
  constructor() {
    this.activeIntervals = new Set();
  }

  /**
   *  glitch caótico y variado a un elemento.
   * @param {HTMLElement} element - El elemento DOM al que se le aplicará el efecto.
   * @param {object} options - Opciones como 'duration'.
   */
  async startChaoticGlitch(element, { duration = 4000 } = {}) {
    if (!element) return;

    const originalHTML = element.innerHTML;
    const startTime = Date.now();

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        clearInterval(intervalId);
        this.activeIntervals.delete(intervalId);
        element.innerHTML = originalHTML; 
        return;
      }
      element.innerHTML = this.applyAdvancedGlitch(element.textContent);
    }, 100); // Frecuencia de actualización del glitch

    this.activeIntervals.add(intervalId);
  }

  /**
   * Algoritmo principal que combina varios tipos de glitch de forma aleatoria.
   * @param {string} text - El texto original.
   * @returns {string} - El texto modificado con HTML para los efectos.
   */
  applyAdvancedGlitch(text) {
    const effectType = Utils.random(0, 4); // Elegir uno de los 5 efectos

    switch (effectType) {
      // 1. Efecto de Desplazamiento RGB
      case 0:
        return `<span class="glitch-text-rgb" data-text="${text}">${text}</span>`;

      // 2. Efecto de Inversión de Color
      case 1:
        return text
          .split("")
          .map((char) =>
            Math.random() < 0.1
              ? `<span class="glitch-inverted">${char}</span>`
              : char
          )
          .join("");

      // 3. Efecto de Desplazamiento de Bloques
      case 2:
        const mid = Math.floor(text.length / 2);
        const chunk1 = text.substring(0, mid);
        const chunk2 = text.substring(mid);
        const shift = Utils.random(-20, 20);
        return `<span style="display:inline-block;">${chunk1}</span><span style="display:inline-block; transform: translateY(${shift}px);">${chunk2}</span>`;

      // 4. Corrupción de Caracteres Intensa
      case 3:
        return Utils.glitchText(text, 0.3);

      // 5. Efecto de "Corte" y Desplazamiento
      default:
        const slicePoint = Utils.random(1, text.length - 1);
        const slice1 = text.substring(0, slicePoint);
        const slice2 = text.substring(slicePoint);
        const shiftX = Utils.random(-30, 30);
        return `<span class="glitch-slice" style="--shift-x: ${shiftX}px">${slice1}</span><span>${slice2}</span>`;
    }
  }

  /**
   * Activa o desactiva una superposición de lineas en toda la terminal.
   * @param {HTMLElement} terminalContainer - El contenedor principal de la terminal.
   * @param {boolean} active - true para activar, false para desactivar.
   */
  toggleScanlines(terminalContainer, active) {
    const existingOverlay =
      terminalContainer.querySelector(".scanline-overlay");
    if (active && !existingOverlay) {
      const overlay = document.createElement("div");
      overlay.className = "scanline-overlay";
      terminalContainer.style.position = "relative";
      terminalContainer.appendChild(overlay);
    } else if (!active && existingOverlay) {
      existingOverlay.remove();
    }
  }

  /**
   * Detiene todos los efectos activos.
   */
  stopAllEffects() {
    this.activeIntervals.forEach(clearInterval);
    this.activeIntervals.clear();
  }
}
