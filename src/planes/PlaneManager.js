import { PLANES, TEMPORAL_CONCEPTIONS, TIMING } from "../utils/constants.js";
import { Utils } from "../utils/helpers.js";
import { globalEventBus, EVENTS } from "../core/EventBus.js";
import { globalStateManager } from "../core/StateManager.js";

import { IntroductionPlane } from "./IntroductionPlane.js";
import { InputPlane } from "./InputPlane.js";
import { ProcessingPlane } from "./ProcessingPlane.js";
import { VisualizationPlane } from "./VisualizationPlane.js";
import { CorruptionPlane } from "./CorruptionPlane.js";
import { RitualPlane } from "./RitualPlane.js";

export class PlaneManager {
  constructor({ terminal, asciiVisualizer, glitchEffects, poeticAPI }) {
    this.terminal = terminal;
    this.planes = new Map();
    this.isTransitioning = false;

    this.planes.set(PLANES.INTRODUCTION, new IntroductionPlane(terminal));
    this.planes.set(
      PLANES.INPUT_1,
      new InputPlane(terminal, { planeId: PLANES.INPUT_1, questionIndex: 0 })
    );
    this.planes.set(
      PLANES.INPUT_2,
      new InputPlane(terminal, { planeId: PLANES.INPUT_2, questionIndex: 1 })
    );
    this.planes.set(
      PLANES.INPUT_3,
      new InputPlane(terminal, { planeId: PLANES.INPUT_3, questionIndex: 2 })
    );
    this.planes.set(
      PLANES.PROCESSING,
      new ProcessingPlane(terminal, poeticAPI)
    );
    this.planes.set(
      TEMPORAL_CONCEPTIONS.CIRCULAR.id,
      new VisualizationPlane(
        { terminal, asciiVisualizer },
        { conception: TEMPORAL_CONCEPTIONS.CIRCULAR }
      )
    );
    this.planes.set(
      TEMPORAL_CONCEPTIONS.RHIZOMATIC.id,
      new VisualizationPlane(
        { terminal, asciiVisualizer },
        { conception: TEMPORAL_CONCEPTIONS.RHIZOMATIC }
      )
    );
    this.planes.set(
      TEMPORAL_CONCEPTIONS.LAYERED.id,
      new VisualizationPlane(
        { terminal, asciiVisualizer },
        { conception: TEMPORAL_CONCEPTIONS.LAYERED }
      )
    );
    this.planes.set(
      PLANES.CORRUPTION,
      new CorruptionPlane(terminal, glitchEffects)
    );
    this.planes.set(PLANES.RITUAL, new RitualPlane(terminal));

    this.setupEventListeners();
  }

  setupEventListeners() {
    globalEventBus.on(EVENTS.PLANE_COMPLETE, (data) =>
      this.handlePlaneComplete(data)
    );
  }

  async handlePlaneComplete({ planeId }) {
    const nextPlaneId = this.getNextPlane(planeId);
    if (nextPlaneId) {
      await Utils.delay(TIMING.TRANSITION_DELAY);
      this.transitionTo(nextPlaneId);
    } else {
      globalEventBus.emit(EVENTS.SYSTEM_COMPLETE);
    }
  }

  getNextPlane(currentPlaneId) {
    if (
      currentPlaneId === PLANES.INPUT_3 &&
      !globalStateManager.hasMemories()
    ) {
      return PLANES.RITUAL;
    }

    switch (currentPlaneId) {
      case PLANES.INTRODUCTION:
        return PLANES.INPUT_1;
      case PLANES.INPUT_1:
        return PLANES.INPUT_2;
      case PLANES.INPUT_2:
        return PLANES.INPUT_3;
      case PLANES.INPUT_3:
        return PLANES.PROCESSING;
      case PLANES.PROCESSING:
        return TEMPORAL_CONCEPTIONS.CIRCULAR.id;
      case TEMPORAL_CONCEPTIONS.CIRCULAR.id:
        return TEMPORAL_CONCEPTIONS.RHIZOMATIC.id;
      case TEMPORAL_CONCEPTIONS.RHIZOMATIC.id:
        return TEMPORAL_CONCEPTIONS.LAYERED.id;
      case TEMPORAL_CONCEPTIONS.LAYERED.id:
        return PLANES.CORRUPTION;
      case PLANES.CORRUPTION:
        return PLANES.RITUAL;
      case PLANES.RITUAL:
        return null;
      default:
        Utils.log(
          `Lógica de transición no definida para: ${currentPlaneId}`,
          "warn"
        );
        return null;
    }
  }

  async transitionTo(planeId) {
    if (this.isTransitioning) return;
    const plane = this.planes.get(planeId);
    if (!plane) {
      Utils.log(`Error: Plano no encontrado: ${planeId}`, "error");
      return;
    }

    this.isTransitioning = true;
    this.terminal.clear();
    await Utils.delay(100);

    globalStateManager.setState({ currentPlane: planeId });
    await plane.enter();
    this.isTransitioning = false;
  }

  async start() {
    await this.transitionTo(PLANES.INTRODUCTION);
  }
}
