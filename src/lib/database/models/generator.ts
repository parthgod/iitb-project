import { Schema, model, models } from "mongoose";

const generatorSchema = new Schema({
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
  MW: {
    type: String,
  },
  MVA: {
    type: String,
  },
  Kv: {
    type: String,
  },
  synchronousReactance: {
    type: Schema.Types.Mixed,
    default: {},
  },
  transientReactance: {
    type: Schema.Types.Mixed,
    default: {},
  },
  subtransientReactance: {
    type: Schema.Types.Mixed,
    default: {},
  },
  transientOCTimeConstant: {
    type: Schema.Types.Mixed,
    default: {},
  },
  subTransientOCTimeConstant: {
    type: Schema.Types.Mixed,
    default: {},
  },
  StatorLeakageInductance: {
    type: Schema.Types.Mixed,
    default: {},
  },
  statorResistance: {
    type: Schema.Types.Mixed,
    default: {},
  },
  inertia: {
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
});

const Generator = models.Generator || model("Generator", generatorSchema);

export default Generator;
