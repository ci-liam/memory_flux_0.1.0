import { Utils } from "../utils/helpers.js";
import { TIMING } from "../utils/constants.js";

export class Terminal {
  constructor(container) {
    this.container = container;
    this.isProcessing = false;
    this.init();
  }

  init() {
    this.container.className = "memory-flux-terminal";
  }

  async writeLine(text, className = "", typewrite = true) {
    const line = document.createElement("div");
    line.className = `terminal-line ${className}`;
    this.container.appendChild(line);
    if (typewrite) {
      await Utils.typeWriter(line, text, TIMING.TYPE_SPEED);
    } else {
      line.innerHTML = text;
    }
    this.scrollToBottom();
    return line;
  }

  async showMessage(message, type = "normal") {
    return await this.writeLine(message, `message ${type}`, true);
  }

  async showPrompt(promptText = ">") {
    if (this.isProcessing) return null;
    this.isProcessing = true;

    const promptLine = document.createElement("div");
    promptLine.className = "terminal-prompt-line";
    const promptSymbol = document.createElement("span");
    promptSymbol.textContent = promptText + " ";
    const inputArea = document.createElement("span");
    inputArea.className = "input-area";
    inputArea.contentEditable = true;

    promptLine.appendChild(promptSymbol);
    promptLine.appendChild(inputArea);
    this.container.appendChild(promptLine);

    const cursor = Utils.addBlinkingCursor(inputArea);
    this.scrollToBottom();
    inputArea.focus();

    return new Promise((resolve) => {
      const handleKeyDown = (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          const command = inputArea.textContent.trim();
          inputArea.contentEditable = false;
          Utils.removeElement(cursor);
          inputArea.removeEventListener("keydown", handleKeyDown);
          this.isProcessing = false;
          resolve(command);
        }
      };
      inputArea.addEventListener("keydown", handleKeyDown);
    });
  }

  clear() {
    this.container.innerHTML = "";
  }

  addSeparator(char = "-", length = 50) {
    return this.writeLine(char.repeat(length), "separator", false);
  }

  scrollToBottom() {
    this.container.scrollTop = this.container.scrollHeight;
  }
}
