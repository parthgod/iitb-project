import { Schema, model, models } from "mongoose";

export interface IVendor extends Document {
  vendorId: string;
  name: string;
  additionalFields: Record<string, any>;
  [key: string]: any;
}

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
