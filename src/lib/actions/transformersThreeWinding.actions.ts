"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import TransformersThreeWinding from "../database/models/transformersThreeWinding";
import { ICreateUpdateParams, ITransformersThreeWinding } from "../../utils/defaultTypes";

export const getAllTransformersThreeWindings = async (): Promise<{
  data: ITransformersThreeWinding[];
  status: number;
}> => {
  try {
    await connectToDatabase();
    const transformersThreeWindings = await TransformersThreeWinding.find({});
    return { data: JSON.parse(JSON.stringify(transformersThreeWindings)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createTransformersThreeWinding = async (req: ICreateUpdateParams) => {
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
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getTransformersThreeWindingById = async (id: string) => {
  try {
    await connectToDatabase();
    const transformersThreeWindingDetails = await TransformersThreeWinding.findById(id);
    if (!transformersThreeWindingDetails) return { data: "TransformersThreeWinding not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(transformersThreeWindingDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateTransformersThreeWinding = async (req: ICreateUpdateParams, id: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await TransformersThreeWinding.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const deleteTransformersThreeWinding = async (id: string, path: string) => {
  try {
    await connectToDatabase();
    const response = await TransformersThreeWinding.findByIdAndDelete(id);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
