import { Schema, model, models } from "mongoose";

const transmissionLineSchema = new Schema({
  deviceName: {
    type: String,
  },
  type: {
    type: String,
  },
  busFrom: {
    type: String,
  },
  busSectionFrom: {
    type: String,
  },
  busTo: {
    type: String,
  },
  busSetionTo: {
    type: String,
  },
  positiveSequence: {
    type: Schema.Types.Mixed,
    default: {},
  },
  negativeSequence: {
    type: Schema.Types.Mixed,
    default: {},
  },
  length: {
    type: String,
  },
  lineReactorFrom: {
    type: String,
  },
  lineReactorTo: {
    type: String,
  },
  additionalFields: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

const TransmissionLine = models.TransmissionLine || model("TransmissionLine", transmissionLineSchema);

export default TransmissionLine;
