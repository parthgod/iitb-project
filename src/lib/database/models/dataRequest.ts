import { Schema, model, models } from "mongoose";

const dataRequestSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
  date: {
    type: Date,
    required: true,
  },
});

const DataRequest = models.DataRequest || model("DataRequest", dataRequestSchema);

export default DataRequest;
