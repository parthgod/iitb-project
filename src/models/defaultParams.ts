import { Schema, model, models } from "mongoose";

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
