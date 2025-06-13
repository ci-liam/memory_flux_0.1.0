import { Utils } from "../utils/helpers.js";

export class EventBus {
  constructor() {
    this.events = {};
  }
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
    return () => this.off(eventName, callback);
  }
  off(eventName, callback) {
    if (!this.events[eventName]) return;
    this.events[eventName] = this.events[eventName].filter(
      (listener) => listener !== callback
    );
  }
  emit(eventName, data) {
    if (!this.events[eventName]) return;
    this.events[eventName].forEach((callback) => callback(data));
  }
}

export const EVENTS = {
  SYSTEM_INIT: "system:init",
  SYSTEM_READY: "system:ready",
  SYSTEM_ERROR: "system:error",
  SYSTEM_COLLAPSE: "system:collapse",
  SYSTEM_COMPLETE: "system:complete",
  // --- NUEVO EVENTO ---
  SYSTEM_RESTART_REQUEST: "system:restart_request", // Evento para solicitar el reinicio
  PLANE_ENTER: "plane:enter",
  PLANE_EXIT: "plane:exit",
  PLANE_COMPLETE: "plane:complete",
  MEMORY_INPUT: "memory:input",
};

export const globalEventBus = new EventBus();
