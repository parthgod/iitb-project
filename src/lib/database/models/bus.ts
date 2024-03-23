import { Schema, model, models } from "mongoose";

const busSchema = new Schema(
  {
    busName: {
      type: String,
      required: true,
    },
    nominalKV: {
      type: String,
      required: true,
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
