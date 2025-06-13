import { TIMING } from "./constants.js";

export class Utils {
  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomChoice(array) {
    if (!array || array.length === 0) return "";
    return array[Math.floor(Math.random() * array.length)];
  }

  static async typeWriter(element, text, speed = TIMING.TYPE_SPEED) {
    element.textContent = "";
    for (let i = 0; i < text.length; i++) {
      element.textContent += text.charAt(i);
      await Utils.delay(speed);
    }
  }

  static createProgressBar(width = 40) {
    let barElement;
    const draw = (percent) => {
      if (!barElement) return;
      const p = Math.floor(percent);
      const filledWidth = Math.round((p / 100) * width);
      const emptyWidth = width - filledWidth;
      const filled = "█".repeat(filledWidth);
      const empty = "░".repeat(emptyWidth);
      barElement.textContent = `[${filled}${empty}] ${p}%`;
    };
    return {
      create(container) {
        barElement = document.createElement("div");
        barElement.className = "progress-bar";
        container.appendChild(barElement);
        draw(0);
      },
      async update(newPercent) {
        const p = Math.max(0, Math.min(100, newPercent));
        draw(p);
        await Utils.delay(50);
      },
    };
  }

  /**
   * --- FUNCIÓN QUE FALTABA ---
   * Aplica un efecto "glitch" a un string de texto.
   * @param {string} text
   * @param {number} intensity
   * @returns {string}
   */
  static glitchText(text, intensity = 0.1) {
    const glitchChars = "!@#$%^&*(){}[]|\\:\";'<>?,./~`█▓▒░";
    if (!text) return "";
    return text
      .split("")
      .map((char) =>
        Math.random() < intensity && char !== " "
          ? this.randomChoice(glitchChars.split(""))
          : char
      )
      .join("");
  }

  static addBlinkingCursor(element) {
    const cursor = document.createElement("span");
    cursor.className = "blinking-cursor";
    cursor.textContent = "█";
    element.appendChild(cursor);
    return cursor;
  }

  static removeElement(element) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  static extractKeywords(text) {
    const stopWords = [
      "el",
      "la",
      "los",
      "las",
      "un",
      "una",
      "y",
      "o",
      "pero",
      "que",
      "de",
      "en",
      "a",
      "con",
      "por",
      "para",
      "es",
      "mi",
      "yo",
      "fue",
    ];
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 3 && !stopWords.includes(word))
      .slice(0, 5);
  }

  static generateId() {
    return "mf_" + Math.random().toString(36).substr(2, 9);
  }

  static log(message, type = "info") {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[${timestamp}] MEMORY_FLUX:`;
    switch (type) {
      case "error":
        console.error(prefix, message);
        break;
      case "warn":
        console.warn(prefix, message);
        break;
      default:
        console.log(prefix, message);
        break;
    }
  }
}
