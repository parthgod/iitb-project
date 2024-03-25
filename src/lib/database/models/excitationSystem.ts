import { Schema, model, models } from "mongoose";

const excitationSystemSchema = new Schema(
  {
    deviceName: {
      type: String,
    },
    automaticVoltageRegulatorAVRType: {
      type: String,
    },
    generatorDeviceName: {
      type: String,
    },
    avrImage: {
      type: String,
    },
    powerSystemStabilizerPSSImage: {
      type: String,
    },
    underExcitationLimiterUELImage: {
      type: String,
    },
    overExcitationLimiterOELImage: {
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

const ExcitationSystem = models.ExcitationSystem || model("ExcitationSystem", excitationSystemSchema);

export default ExcitationSystem;
