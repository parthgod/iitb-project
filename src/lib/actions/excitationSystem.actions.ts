"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import { handleError } from "../../utils/helperFunctions";
import ExcitationSystem from "../database/models/excitationSystem";

export const getAllExcitationSystems = async () => {
  try {
    await connectToDatabase();
    const excitationSystems = await ExcitationSystem.find({});
    return { data: JSON.parse(JSON.stringify(excitationSystems)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const createExcitationSystem = async (req: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newExcitationSystem = new ExcitationSystem({
      ...defaultFields,
      additionalFields,
    });
    await newExcitationSystem.save();
    return { data: JSON.parse(JSON.stringify(newExcitationSystem)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const getExcitationSystemById = async (id: any) => {
  try {
    await connectToDatabase();
    const excitationSystemDetails = await ExcitationSystem.findById(id);
    if (!excitationSystemDetails) return { data: "Excitation system not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(excitationSystemDetails)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const updateExcitationSystem = async (req: any, id: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await ExcitationSystem.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const deleteExcitationSystem = async (id: any, path: any) => {
  try {
    await connectToDatabase();
    const response = await ExcitationSystem.findByIdAndDelete(id);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    handleError(error);
  }
};
