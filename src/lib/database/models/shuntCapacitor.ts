import { Schema, model, models } from "mongoose";

const shuntCapacitorSchema = new Schema({
  deviceName: {
    type: String,
  },
  busFrom: {
    type: String,
  },
  busSectionFrom: {
    type: String,
  },
  kV: {
    type: String,
  },
  MVA: {
    type: String,
  },
  additionalFields: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

const ShuntCapacitor = models.ShuntCapacitor || model("ShuntCapacitor", shuntCapacitorSchema);

export default ShuntCapacitor;
