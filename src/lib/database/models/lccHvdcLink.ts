import { Schema, model, models } from "mongoose";

const lccHvdcLinkSchema = new Schema(
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

const LCCHVDCLink = models.LCCHVDCLink || model("LCCHVDCLink", lccHvdcLinkSchema);

export default LCCHVDCLink;
