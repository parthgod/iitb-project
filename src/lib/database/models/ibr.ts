import { Schema, model, models } from "mongoose";

const ibrSchema = new Schema(
  {
    additionalFields: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    collectionOptions: { changeStreamPreAndPostImages: { enabled: true } },
  }
);

const IBR = models.IBR || model("IBR", ibrSchema);

export default IBR;
