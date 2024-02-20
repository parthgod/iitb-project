import { Schema, model, models } from "mongoose";

export interface IColumn {
  field: string;
  title: string;
  type: string;
  isDefault: boolean;
}

export interface IDefaultParamSchema {
  vendorColumns: IColumn[];
  productColumns: IColumn[];
  warehouseColumns: IColumn[];
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
  productColumns: {
    type: Array,
    default: [
      {
        field: "productId",
        title: "Product ID",
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
  warehouseColumns: {
    type: Array,
    default: [
      {
        field: "warehouseId",
        title: "Warehouse ID",
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
