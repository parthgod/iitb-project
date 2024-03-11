import { Schema, model, models } from "mongoose";

const generatorSchema = new Schema(
  {
    deviceName: {
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
    synchronousReactancePu: {
      type: Schema.Types.Mixed,
      default: {},
    },
    transientReactancePu: {
      type: Schema.Types.Mixed,
      default: {},
    },
    subtransientReactancePu: {
      type: Schema.Types.Mixed,
      default: {},
    },
    transientOCTimeConstantSeconds: {
      type: Schema.Types.Mixed,
      default: {},
    },
    subtransientOCTimeConstantSeconds: {
      type: Schema.Types.Mixed,
      default: {},
    },
    statorLeakageInductancePu: {
      type: Schema.Types.Mixed,
      default: {},
    },
    statorResistancePu: {
      type: Schema.Types.Mixed,
      default: {},
    },
    inertiaMJMVA: {
      type: Schema.Types.Mixed,
      default: {},
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
