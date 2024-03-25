import { Schema, model, models } from "mongoose";

const busSchema = new Schema(
  {
    busName: {
      type: String,
    },
    nominalKV: {
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

const Bus = models.Bus || model("Bus", busSchema);

export default Bus;
