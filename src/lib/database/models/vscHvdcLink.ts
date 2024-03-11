import { Schema, model, models } from "mongoose";

const vscHvdcLinkSchema = new Schema(
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

const VSCHVDCLink = models.VSCHVDCLink || model("VSCHVDCLink", vscHvdcLinkSchema);

export default VSCHVDCLink;
