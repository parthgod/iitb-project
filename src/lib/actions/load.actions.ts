"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import { handleError } from "../../utils/helperFunctions";
import Load from "../database/models/load";

export const getAllLoads = async () => {
  try {
    await connectToDatabase();
    const loads = await Load.find({});
    return { data: JSON.parse(JSON.stringify(loads)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const createLoad = async (req: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newLoad = new Load({
      ...defaultFields,
      additionalFields,
    });
    await newLoad.save();
    return { data: JSON.parse(JSON.stringify(newLoad)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const getLoadById = async (id: any) => {
  try {
    await connectToDatabase();
    const loadDetails = await Load.findById(id);
    if (!loadDetails) return { data: "Load not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(loadDetails)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const updateLoad = async (req: any, id: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await Load.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const deleteLoad = async (id: any, path: any) => {
  try {
    await connectToDatabase();
    const response = await Load.findByIdAndDelete(id);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    handleError(error);
  }
};
