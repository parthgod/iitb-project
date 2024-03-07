import { Schema, model, models } from "mongoose";

const turbineGovernorSchema = new Schema({
  deviceName: {
    type: String,
  },
  turbineType: {
    type: String,
  },
  generatorDeviceName: {
    type: String,
  },
  turbineModelImage: {
    type: String,
  },
  additionalFields: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

const TurbineGovernor = models.TurbineGovernor || model("TurbineGovernor", turbineGovernorSchema);

export default TurbineGovernor;
