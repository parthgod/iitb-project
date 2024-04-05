import { Schema, model, models } from "mongoose";

const loadSchema = new Schema(
  {
    deviceName: {
      type: String,
    },
    location: {
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
    pMW: {
      type: String,
    },
    qMvar: {
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

const Load = models.Load || model("Load", loadSchema);

export default Load;
