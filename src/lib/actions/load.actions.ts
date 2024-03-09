"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import Load from "../database/models/load";
import { ICreateUpdateParams, ILoad } from "../../utils/defaultTypes";

export const getAllLoads = async (): Promise<{ data: ILoad[]; status: number }> => {
  try {
    await connectToDatabase();
    const loads = await Load.find({});
    return { data: JSON.parse(JSON.stringify(loads)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createLoad = async (req: ICreateUpdateParams) => {
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
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getLoadById = async (id: string) => {
  try {
    await connectToDatabase();
    const loadDetails = await Load.findById(id);
    if (!loadDetails) return { data: "Load not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(loadDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateLoad = async (req: ICreateUpdateParams, id: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await Load.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const deleteLoad = async (id: string, path: string) => {
  try {
    await connectToDatabase();
    const response = await Load.findByIdAndDelete(id);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
