import { Schema, model, models } from "mongoose";

const transformersThreeWindingSchema = new Schema({
  deviceName: {
    type: String,
  },
  busPrimaryFrom: {
    type: String,
  },
  busPrimarySectionFrom: {
    type: String,
  },
  busSecondaryTo: {
    type: String,
  },
  busSecondarySetionTo: {
    type: String,
  },
  busTertiaryTo: {
    type: String,
  },
  busTertiarySectionTo: {
    type: String,
  },
  MVA: {
    type: String,
  },
  kVPrimaryVoltage: {
    type: String,
  },
  kVSecondaryVoltage: {
    type: String,
  },
  kVTertiaryVoltage: {
    type: String,
  },
  PrimarySecondary: {
    type: Schema.Types.Mixed,
    default: {},
  },
  PrimaryTertiary: {
    type: Schema.Types.Mixed,
    default: {},
  },
  SecondaryTertiary: {
    type: Schema.Types.Mixed,
    default: {},
  },
  tapPrimary: {
    type: String,
  },
  tapSecondary: {
    type: String,
  },
  tapTertiary: {
    type: String,
  },
  primaryConnection: {
    type: String,
  },
  primaryConnectionGrounding: {
    type: String,
  },
  secondaryConnection: {
    type: String,
  },
  secondaryConnectionGrounding: {
    type: String,
  },
  tertiaryConnection: {
    type: String,
  },
  tertiaryConnectionGrounding: {
    type: String,
  },
  additionalFields: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

const TransformersThreeWinding =
  models.TransformersThreeWinding || model("TransformersThreeWinding", transformersThreeWindingSchema);

export default TransformersThreeWinding;
