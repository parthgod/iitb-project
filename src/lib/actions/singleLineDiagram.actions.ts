"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import { handleError } from "../../utils/helperFunctions";
import SingleLineDiagram from "../database/models/singleLineDiagram";

export const getAllSingleLineDiagrams = async () => {
  try {
    await connectToDatabase();
    const singleLineDiagrams = await SingleLineDiagram.find({});
    return { data: JSON.parse(JSON.stringify(singleLineDiagrams)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const createSingleLineDiagram = async (req: any) => {
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
    handleError(error);
  }
};

export const getSingleLineDiagramById = async (id: any) => {
  try {
    await connectToDatabase();
    const singleLineDiagramDetails = await SingleLineDiagram.findById(id);
    if (!singleLineDiagramDetails) return { data: "SingleLineDiagram not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(singleLineDiagramDetails)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const updateSingleLineDiagram = async (req: any, id: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await SingleLineDiagram.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const deleteSingleLineDiagram = async (id: any, path: any) => {
  try {
    await connectToDatabase();
    const response = await SingleLineDiagram.findByIdAndDelete(id);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    handleError(error);
  }
};
