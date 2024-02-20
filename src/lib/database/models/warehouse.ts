import { Schema, model, models } from "mongoose";

export interface IWarehouse extends Document {
  warehouseId: string;
  name: string;
  additionalFields: Record<string, any>;
  [key: string]: any;
  _id: string;
}

const warehouseSchema = new Schema({
  warehouseId: {
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

const Warehouse = models.Warehouse || model("Warehouse", warehouseSchema);

export default Warehouse;
