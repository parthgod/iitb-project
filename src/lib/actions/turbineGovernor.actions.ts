"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import { handleError } from "../../utils/helperFunctions";
import TurbineGovernor from "../database/models/turbineGovernorColumns";

export const getAllTurbineGovernors = async () => {
  try {
    await connectToDatabase();
    const turbineGovernors = await TurbineGovernor.find({});
    return { data: JSON.parse(JSON.stringify(turbineGovernors)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const createTurbineGovernor = async (req: any) => {
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
    handleError(error);
  }
};

export const getTurbineGovernorById = async (id: any) => {
  try {
    await connectToDatabase();
    const turbineGovernorDetails = await TurbineGovernor.findById(id);
    if (!turbineGovernorDetails) return { data: "TurbineGovernor not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(turbineGovernorDetails)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const updateTurbineGovernor = async (req: any, id: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await TurbineGovernor.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const deleteTurbineGovernor = async (id: any, path: any) => {
  try {
    await connectToDatabase();
    const response = await TurbineGovernor.findByIdAndDelete(id);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    handleError(error);
  }
};
