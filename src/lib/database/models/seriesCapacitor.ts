import { Schema, model, models } from "mongoose";

const seriesCapacitorSchema = new Schema(
  {
    id: {
      type: String,
    },
    deviceName: {
      type: String,
    },
    mvar: {
      type: String,
    },
    compensation: {
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

const SeriesCapacitor = models.SeriesCapacitor || model("SeriesCapacitor", seriesCapacitorSchema);

export default SeriesCapacitor;
