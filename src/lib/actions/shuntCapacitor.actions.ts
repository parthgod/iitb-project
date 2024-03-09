"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import ShuntCapacitor from "../database/models/shuntCapacitor";
import { ICreateUpdateParams, IShuntCapacitor } from "../../utils/defaultTypes";

export const getAllShuntCapacitors = async (): Promise<{ data: IShuntCapacitor[]; status: number }> => {
  try {
    await connectToDatabase();
    const shuntCapacitors = await ShuntCapacitor.find({});
    return { data: JSON.parse(JSON.stringify(shuntCapacitors)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createShuntCapacitor = async (req: ICreateUpdateParams) => {
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
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getShuntCapacitorById = async (id: string) => {
  try {
    await connectToDatabase();
    const shuntCapacitorDetails = await ShuntCapacitor.findById(id);
    if (!shuntCapacitorDetails) return { data: "Shunt Capacitor not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(shuntCapacitorDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateShuntCapacitor = async (req: ICreateUpdateParams, id: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await ShuntCapacitor.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const deleteShuntCapacitor = async (id: string, path: string) => {
  try {
    await connectToDatabase();
    const response = await ShuntCapacitor.findByIdAndDelete(id);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
