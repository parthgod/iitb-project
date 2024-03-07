"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import Bus from "../database/models/bus";
import { handleError } from "../../utils/helperFunctions";

export const getAllBuses = async () => {
  try {
    await connectToDatabase();
    const buses = await Bus.find({});
    return { data: JSON.parse(JSON.stringify(buses)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const createBus = async (req: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newBus = new Bus({
      ...defaultFields,
      additionalFields,
    });
    await newBus.save();
    return { data: JSON.parse(JSON.stringify(newBus)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const getBusById = async (id: any) => {
  try {
    await connectToDatabase();
    const busDetails = await Bus.findById(id);
    if (!busDetails) return { data: "Bus not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(busDetails)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const updateBus = async (req: any, id: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await Bus.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const deleteBus = async (id: any, path: any) => {
  try {
    await connectToDatabase();
    const response = await Bus.findByIdAndDelete(id);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    handleError(error);
  }
};
