"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import { handleError } from "../../utils/helperFunctions";
import Product from "../database/models/product";

export const getAllProducts = async () => {
  try {
    await connectToDatabase();
    const products = await Product.find({});
    return { data: JSON.parse(JSON.stringify(products)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const createProduct = async (req: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const alreadyExists = await Product.findOne({ productId: defaultFields.productId });
    if (alreadyExists) return { data: "Product already exists", status: 409 };
    const newProduct = new Product({
      ...defaultFields,
      additionalFields,
    });
    await newProduct.save();
    return { data: JSON.parse(JSON.stringify(newProduct)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const getProductById = async (productId: any) => {
  try {
    await connectToDatabase();
    const productDetails = await Product.findOne({ productId: productId });
    if (!productDetails) return { data: "Product not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(productDetails)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const updateProduct = async (req: any, productId: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await Product.findByIdAndUpdate(productId, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const deleteProduct = async (productId: any, path: any) => {
  try {
    await connectToDatabase();
    const response = await Product.findByIdAndDelete(productId);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    handleError(error);
  }
};
