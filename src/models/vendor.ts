import { Schema, model, models } from "mongoose";

const vendorSchema = new Schema({
  vendorId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  additionalFields: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

const Vendor = models.Vendor || model("Vendor", vendorSchema);

export default Vendor;
