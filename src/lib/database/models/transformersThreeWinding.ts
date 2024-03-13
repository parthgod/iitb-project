import { Schema, model, models } from "mongoose";

const transformersThreeWindingSchema = new Schema(
  {
    id: {
      type: String,
    },
    deviceName: {
      type: String,
    },
    busprimaryFrom: {
      type: String,
    },
    busprimarySectionFrom: {
      type: String,
    },
    bussecondaryTo: {
      type: String,
    },
    busSectionSecondaryTo: {
      type: String,
    },
    bustertiaryTo: {
      type: String,
    },
    busSectionTertiaryTo: {
      type: String,
    },
    mva: {
      type: String,
    },
    kvprimaryVoltage: {
      type: String,
    },
    kvsecondaryVoltage: {
      type: String,
    },
    kvtertiaryVoltage: {
      type: String,
    },
    psprimarysecondary: {
      type: Schema.Types.Mixed,
      default: {},
    },
    ptprimarytertiary: {
      type: Schema.Types.Mixed,
      default: {},
    },
    stsecondarytertiary: {
      type: Schema.Types.Mixed,
      default: {},
    },
    TapPrimary: {
      type: String,
    },
    TapSecondary: {
      type: String,
    },
    TapTertiary: {
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
  },
  {
    collectionOptions: { changeStreamPreAndPostImages: { enabled: true } },
  }
);

const TransformersThreeWinding =
  models.TransformersThreeWinding || model("TransformersThreeWinding", transformersThreeWindingSchema);

export default TransformersThreeWinding;
