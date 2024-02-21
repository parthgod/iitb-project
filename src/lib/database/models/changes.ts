import { ObjectId } from "mongodb";
import { Schema, model, models } from "mongoose";

export interface IChange {
  user: ObjectId;
  message: string;
}

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
  date: {
    type: Date,
    required: true,
  },
});

const Changes = models.Changes || model("Changes", changesSchema);

export default Changes;
