import { Schema, model, models } from "mongoose";

const lccHvdcLinkSchema = new Schema(
  {
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
