"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import { handleError } from "../../utils/helperFunctions";
import TransformersThreeWinding from "../database/models/transformersThreeWinding";

export const getAllTransformersThreeWindings = async () => {
  try {
    await connectToDatabase();
    const transformersThreeWindings = await TransformersThreeWinding.find({});
    return { data: JSON.parse(JSON.stringify(transformersThreeWindings)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const createTransformersThreeWinding = async (req: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newTransformersThreeWinding = new TransformersThreeWinding({
      ...defaultFields,
      additionalFields,
    });
    await newTransformersThreeWinding.save();
    return { data: JSON.parse(JSON.stringify(newTransformersThreeWinding)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const getTransformersThreeWindingById = async (id: any) => {
  try {
    await connectToDatabase();
    const transformersThreeWindingDetails = await TransformersThreeWinding.findById(id);
    if (!transformersThreeWindingDetails) return { data: "TransformersThreeWinding not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(transformersThreeWindingDetails)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const updateTransformersThreeWinding = async (req: any, id: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await TransformersThreeWinding.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const deleteTransformersThreeWinding = async (id: any, path: any) => {
  try {
    await connectToDatabase();
    const response = await TransformersThreeWinding.findByIdAndDelete(id);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    handleError(error);
  }
};
