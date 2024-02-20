import { Schema, model, models } from "mongoose";

export interface IProduct extends Document {
  _id: string;
  productId: string;
  name: string;
  additionalFields: Record<string, any>;
  [key: string]: any;
}

const productSchema = new Schema({
  productId: {
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

const Product = models.Product || model("Product", productSchema);

export default Product;
