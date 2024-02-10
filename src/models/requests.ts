import { Schema, model, models } from "mongoose";

const requestSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const Request = models.Request || model("Request", requestSchema);

export default Request;
