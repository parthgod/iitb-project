import { Schema, model, models } from "mongoose";

const changesSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const Changes = models.Changes || model("Changes", changesSchema);

export default Changes;
