import { Schema, model, models } from "mongoose";

const shuntCapacitorSchema = new Schema(
  {
    deviceName: {
      type: String,
    },
    busFrom: {
      type: String,
    },
    busSectionFrom: {
      type: String,
    },
    kv: {
      type: String,
    },
    mva: {
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

const ShuntCapacitor = models.ShuntCapacitor || model("ShuntCapacitor", shuntCapacitorSchema);

export default ShuntCapacitor;
