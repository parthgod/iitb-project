import { Schema, model, models } from "mongoose";

const transformersTwoWindingSchema = new Schema({
  deviceName: {
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
  busSetionTo: {
    type: String,
  },
  MVA: {
    type: String,
  },
  kVPrimary: {
    type: String,
  },
  kVSecondary: {
    type: String,
  },
  R: {
    type: String,
  },
  X: {
    type: String,
  },
  tapPrimary: {
    type: String,
  },
  tapSecondary: {
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
});

const TransformersTwoWinding =
  models.TransformersTwoWinding || model("TransformersTwoWinding", transformersTwoWindingSchema);

export default TransformersTwoWinding;
