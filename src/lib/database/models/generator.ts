import { Schema, model, models } from "mongoose";

const generatorSchema = new Schema(
  {
    deviceName: {
      type: String,
    },
    circuitBreakerStatus: {
      type: String,
    },
    busTo: {
      type: String,
    },
    busSectionTo: {
      type: String,
    },
    type: {
      type: String,
    },
    rotor: {
      type: String,
    },
    mw: {
      type: String,
    },
    mva: {
      type: String,
    },
    kv: {
      type: String,
    },
    synchronousReactancePuXd: {
      type: String,
    },
    synchronousReactancePuXq: {
      type: String,
    },
    transientReactancePuXdPrime: {
      type: String,
    },
    transientReactancePuXqPrime: {
      type: String,
    },
    subtransientReactancePuXdPrimePrime: {
      type: String,
    },
    subtransientReactancePuXqPrimePrime: {
      type: String,
    },
    transientOCTimeConstantSecondsTd0Prime: {
      type: String,
    },
    transientOCTimeConstantSecondsTq0Prime: {
      type: String,
    },
    subtransientOCTimeConstantSecondsTd0PrimePrime: {
      type: String,
    },
    subtransientOCTimeConstantSecondsTq0PrimePrime: {
      type: String,
    },
    statorLeakageInductancePuXl: {
      type: String,
    },
    statorResistancePuRa: {
      type: String,
    },
    inertiaMJMVAH: {
      type: String,
    },
    poles: {
      type: String,
    },
    speed: {
      type: String,
    },
    frequency: {
      type: String,
    },
    additionalFields: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    collectionOptions: { changeStreamPreAndPostImages: { enabled: true } },
  }
);

const Generator = models.Generator || model("Generator", generatorSchema);

export default Generator;
