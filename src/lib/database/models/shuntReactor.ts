import { Schema, model, models } from "mongoose";

const shuntReactorSchema = new Schema(
  {
    id: {
      type: String,
    },
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

const ShuntReactor = models.ShuntReactor || model("ShuntReactor", shuntReactorSchema);

export default ShuntReactor;
