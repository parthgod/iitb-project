import { Schema, model, models } from "mongoose";

const shuntFactsSchema = new Schema(
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

const ShuntFacts = models.ShuntFacts || model("ShuntFacts", shuntFactsSchema);

export default ShuntFacts;
