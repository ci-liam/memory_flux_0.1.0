export const TIMING = {
  TYPE_SPEED: 40,
  TRANSITION_DELAY: 1500,
};

export const TEMPORAL_CONCEPTIONS = {
  CIRCULAR: { id: "circular", name: "CIRCULAR", index: 0 },
  RHIZOMATIC: { id: "rhizomatic", name: "RIZOMÁTICA", index: 1 },
  LAYERED: { id: "layered", name: "EN CAPAS", index: 2 },
};

export const PLANES = {
  INTRODUCTION: "introduction",
  INPUT_1: "input_1",
  INPUT_2: "input_2",
  INPUT_3: "input_3",
  PROCESSING: "processing",
  VISUALIZATION_1: TEMPORAL_CONCEPTIONS.CIRCULAR.id,
  VISUALIZATION_2: TEMPORAL_CONCEPTIONS.RHIZOMATIC.id,
  VISUALIZATION_3: TEMPORAL_CONCEPTIONS.LAYERED.id,
  CORRUPTION: "corruption",
  RITUAL: "ritual",
};

export const MESSAGES = {
  INTRODUCTION: {
    subtitle: "Una experiencia sobre la fragilidad de la memoria digital.",
  },
  INPUTS: [
    "Describe un recuerdo que se siente lejano.",
    "Piensa en una conversación que desearías poder olvidar.",
    "Recuerda un lugar que ya no existe.",
  ],
  RITUAL: {
    instructions: [
      "1. Toma un trozo de papel.",
      "2. Escribe a mano uno de los recuerdos que liberaste.",
      "3. No intentes ser fiel. Escribe lo que surja.",
      "4. Una vez terminado, destruye el papel.",
      "5. La memoria ha sido transformada.",
    ],
  },
};
