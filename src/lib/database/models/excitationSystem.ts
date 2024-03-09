import { Schema, model, models } from "mongoose";

const excitationSystemSchema = new Schema({
  deviceName: {
    type: String,
    required: true,
  },
  automaticVoltageRegulatorAVRType: {
    type: String,
    required: true,
  },
  generatorDeviceName: {
    type: String,
    required: true,
  },
  avrImage: {
    type: String,
    required: true,
  },
  powerSystemStabilizerPSSImage: {
    type: String,
    required: true,
  },
  underExcitationLimiterUELImage: {
    type: String,
    required: true,
  },
  overExcitationLimiterOELImage: {
    type: String,
    required: true,
  },
  additionalFields: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

const ExcitationSystem = models.ExcitationSystem || model("ExcitationSystem", excitationSystemSchema);

export default ExcitationSystem;
