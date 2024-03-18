import { Schema, model, models } from "mongoose";

const lccHVDCLinkSchema = new Schema(
  {
    id: {
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

const LCCHVDCLink = models.LCCHVDCLink || model("LCCHVDCLink", lccHVDCLinkSchema);

export default LCCHVDCLink;
