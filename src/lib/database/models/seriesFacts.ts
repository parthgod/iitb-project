import { Schema, model, models } from "mongoose";

const seriesFactsSchema = new Schema(
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

const SeriesFacts = models.SeriesFacts || model("SeriesFacts", seriesFactsSchema);

export default SeriesFacts;
