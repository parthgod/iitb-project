"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import TurbineGovernor from "../database/models/turbineGovernorColumns";
import { ICreateUpdateParams, ITurbineGovernor } from "../../utils/defaultTypes";

export const getAllTurbineGovernors = async (): Promise<{ data: ITurbineGovernor[]; status: number }> => {
  try {
    await connectToDatabase();
    const turbineGovernors = await TurbineGovernor.find({});
    return { data: JSON.parse(JSON.stringify(turbineGovernors)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createTurbineGovernor = async (req: ICreateUpdateParams) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newTurbineGovernor = new TurbineGovernor({
      ...defaultFields,
      additionalFields,
    });
    await newTurbineGovernor.save();
    return { data: JSON.parse(JSON.stringify(newTurbineGovernor)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getTurbineGovernorById = async (id: string) => {
  try {
    await connectToDatabase();
    const turbineGovernorDetails = await TurbineGovernor.findById(id);
    if (!turbineGovernorDetails) return { data: "TurbineGovernor not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(turbineGovernorDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateTurbineGovernor = async (req: ICreateUpdateParams, id: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await TurbineGovernor.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const deleteTurbineGovernor = async (id: string, path: string) => {
  try {
    await connectToDatabase();
    const response = await TurbineGovernor.findByIdAndDelete(id);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
