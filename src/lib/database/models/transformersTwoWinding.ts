import { Schema, model, models } from "mongoose";

const transformersTwoWindingSchema = new Schema(
  {
    deviceName: {
      type: String,
    },
    circuitBreakerStatus: {
      type: String,
    },
    busFrom: {
      type: String,
    },
    busSectionFrom: {
      type: String,
    },
    busTo: {
      type: String,
    },
    busSectionTo: {
      type: String,
    },
    mva: {
      type: String,
    },
    kvprimary: {
      type: String,
    },
    kvsecondary: {
      type: String,
    },
    r: {
      type: String,
    },
    x: {
      type: String,
    },
    TapPrimary: {
      type: String,
    },
    TapSecondary: {
      type: String,
    },
    primaryWindingConnection: {
      type: String,
    },
    primaryConnectionGrounding: {
      type: String,
    },
    secondaryWindingConnection: {
      type: String,
    },
    secondaryConnectionGrounding: {
      type: String,
    },
    angle: {
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

const TransformersTwoWinding =
  models.TransformersTwoWinding || model("TransformersTwoWinding", transformersTwoWindingSchema);

export default TransformersTwoWinding;
