"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import SingleLineDiagram from "../database/models/singleLineDiagram";
import { ICreateUpdateParams, ISingleLineDiagram } from "../../utils/defaultTypes";

export const getAllSingleLineDiagrams = async (): Promise<{ data: ISingleLineDiagram[]; status: number }> => {
  try {
    await connectToDatabase();
    const singleLineDiagrams = await SingleLineDiagram.find({});
    return { data: JSON.parse(JSON.stringify(singleLineDiagrams)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createSingleLineDiagram = async (req: ICreateUpdateParams) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newSingleLineDiagram = new SingleLineDiagram({
      ...defaultFields,
      additionalFields,
    });
    await newSingleLineDiagram.save();
    return { data: JSON.parse(JSON.stringify(newSingleLineDiagram)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getSingleLineDiagramById = async (id: string) => {
  try {
    await connectToDatabase();
    const singleLineDiagramDetails = await SingleLineDiagram.findById(id);
    if (!singleLineDiagramDetails) return { data: "SingleLineDiagram not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(singleLineDiagramDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateSingleLineDiagram = async (req: ICreateUpdateParams, id: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await SingleLineDiagram.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const deleteSingleLineDiagram = async (id: string, path: string) => {
  try {
    await connectToDatabase();
    const response = await SingleLineDiagram.findByIdAndDelete(id);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
