import { Schema, model, models } from "mongoose";

export interface IVendorColumn {
  field: string;
  title: string;
  type: string;
  isDefault: boolean;
}

export interface IDefaultParamSchema {
  vendorColumns: IVendorColumn[];
}
const defaultParamSchema = new Schema({
  vendorColumns: {
    type: Array,
    default: [
      {
        field: "vendorId",
        title: "Vendor ID",
        type: "text",
        isDefault: true,
      },
      {
        field: "name",
        title: "Name",
        type: "text",
        isDefault: true,
      },
    ],
  },
});

const DefaultParam = models.DefaultParam || model("DefaultParam", defaultParamSchema);

export default DefaultParam;
