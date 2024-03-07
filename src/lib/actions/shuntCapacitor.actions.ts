"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import { handleError } from "../../utils/helperFunctions";
import ShuntCapacitor from "../database/models/shuntCapacitor";

export const getAllShuntCapacitors = async () => {
  try {
    await connectToDatabase();
    const shuntCapacitors = await ShuntCapacitor.find({});
    return { data: JSON.parse(JSON.stringify(shuntCapacitors)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const createShuntCapacitor = async (req: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newShuntCapacitor = new ShuntCapacitor({
      ...defaultFields,
      additionalFields,
    });
    await newShuntCapacitor.save();
    return { data: JSON.parse(JSON.stringify(newShuntCapacitor)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const getShuntCapacitorById = async (id: any) => {
  try {
    await connectToDatabase();
    const shuntCapacitorDetails = await ShuntCapacitor.findById(id);
    if (!shuntCapacitorDetails) return { data: "Shunt Capacitor not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(shuntCapacitorDetails)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const updateShuntCapacitor = async (req: any, id: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await ShuntCapacitor.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const deleteShuntCapacitor = async (id: any, path: any) => {
  try {
    await connectToDatabase();
    const response = await ShuntCapacitor.findByIdAndDelete(id);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    handleError(error);
  }
};
