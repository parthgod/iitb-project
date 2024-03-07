import { Schema, model, models } from "mongoose";

export interface IBus extends Document {
  vendorId: string;
  name: string;
  additionalFields: Record<string, any>;
  [key: string]: any;
}

const busSchema = new Schema({
  busName: {
    type: String,
    required: true,
  },
  nominalKV: {
    type: String,
    required: true,
  },
  additionalFields: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

const Bus = models.Bus || model("Bus", busSchema);

export default Bus;
