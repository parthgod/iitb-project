import { Schema, model, models } from "mongoose";

const seriesCapacitorSchema = new Schema({
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
});

const SeriesCapacitor = models.SeriesCapacitor || model("SeriesCapacitor", seriesCapacitorSchema);

export default SeriesCapacitor;
