import { Schema, model, models } from "mongoose";

const vscHVDCLinkSchema = new Schema(
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

const VSCHVDCLink = models.VSCHVDCLink || model("VSCHVDCLink", vscHVDCLinkSchema);

export default VSCHVDCLink;
