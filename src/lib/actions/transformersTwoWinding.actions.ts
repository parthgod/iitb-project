"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import { handleError } from "../../utils/helperFunctions";
import TransformersTwoWinding from "../database/models/transformersTwoWinding";

export const getAllTransformersTwoWindings = async () => {
  try {
    await connectToDatabase();
    const transformersTwoWindings = await TransformersTwoWinding.find({});
    return { data: JSON.parse(JSON.stringify(transformersTwoWindings)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const createTransformersTwoWinding = async (req: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newTransformersTwoWinding = new TransformersTwoWinding({
      ...defaultFields,
      additionalFields,
    });
    await newTransformersTwoWinding.save();
    return { data: JSON.parse(JSON.stringify(newTransformersTwoWinding)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const getTransformersTwoWindingById = async (id: any) => {
  try {
    await connectToDatabase();
    const transformersTwoWindingDetails = await TransformersTwoWinding.findById(id);
    if (!transformersTwoWindingDetails) return { data: "TransformersTwoWinding not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(transformersTwoWindingDetails)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const updateTransformersTwoWinding = async (req: any, id: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await TransformersTwoWinding.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const deleteTransformersTwoWinding = async (id: any, path: any) => {
  try {
    await connectToDatabase();
    const response = await TransformersTwoWinding.findByIdAndDelete(id);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    handleError(error);
  }
};
