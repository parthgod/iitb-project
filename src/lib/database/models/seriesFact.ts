import { Schema, model, models } from "mongoose";

const seriesFactsSchema = new Schema(
  {
    id: {
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

const SeriesFact = models.SeriesFact || model("SeriesFact", seriesFactsSchema);

export default SeriesFact;
