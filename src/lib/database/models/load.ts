import { Schema, model, models } from "mongoose";

const loadSchema = new Schema({
  deviceName: {
    type: String,
  },
  busFrom: {
    type: String,
  },
  busSectionFrom: {
    type: String,
  },
  PMW: {
    type: String,
  },
  QMvar: {
    type: String,
  },
  additionalFields: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

const Load = models.Load || model("Load", loadSchema);

export default Load;
