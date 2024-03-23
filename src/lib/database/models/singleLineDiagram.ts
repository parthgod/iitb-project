import { Schema, model, models } from "mongoose";

const singleLineDiagramSchema = new Schema(
  {
    description: {
      type: String,
    },
    image: {
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

const SingleLineDiagram = models.SingleLineDiagram || model("SingleLineDiagram", singleLineDiagramSchema);

export default SingleLineDiagram;
