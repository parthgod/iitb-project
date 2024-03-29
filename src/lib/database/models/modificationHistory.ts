import { Schema, model, models } from "mongoose";

const modificationHistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    databaseName: {
      type: String,
    },
    operationType: {
      type: String,
    },
    date: {
      type: Date,
    },
    message: {
      type: String,
    },
    document: {
      id: { type: String },
      documentBeforeChange: { type: Schema.Types.Mixed },
      documentAfterChange: { type: Schema.Types.Mixed },
      columnDetails: { type: Schema.Types.Mixed },
    },
  },
  {
    collectionOptions: { changeStreamPreAndPostImages: { enabled: true } },
  }
);

const ModificationHistory = models.ModificationHistory || model("ModificationHistory", modificationHistorySchema);

export default ModificationHistory;
