"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import { handleError } from "../../utils/helperFunctions";
import ShuntReactor from "../database/models/shuntReactor";

export const getAllShuntReactors = async () => {
  try {
    await connectToDatabase();
    const shuntReactors = await ShuntReactor.find({});
    return { data: JSON.parse(JSON.stringify(shuntReactors)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const createShuntReactor = async (req: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newShuntReactor = new ShuntReactor({
      ...defaultFields,
      additionalFields,
    });
    await newShuntReactor.save();
    return { data: JSON.parse(JSON.stringify(newShuntReactor)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const getShuntReactorById = async (id: any) => {
  try {
    await connectToDatabase();
    const shuntReactorDetails = await ShuntReactor.findById(id);
    if (!shuntReactorDetails) return { data: "ShuntReactor not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(shuntReactorDetails)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const updateShuntReactor = async (req: any, id: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await ShuntReactor.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const deleteShuntReactor = async (id: any, path: any) => {
  try {
    await connectToDatabase();
    const response = await ShuntReactor.findByIdAndDelete(id);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    handleError(error);
  }
};
