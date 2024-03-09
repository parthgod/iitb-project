"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import Bus from "../database/models/bus";
import { IBus, ICreateUpdateParams } from "../../utils/defaultTypes";

export const getAllBuses = async (): Promise<{ data: IBus[]; status: number }> => {
  try {
    await connectToDatabase();
    const buses = await Bus.find({});
    return { data: JSON.parse(JSON.stringify(buses)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createBus = async (req: ICreateUpdateParams) => {
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
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getBusById = async (id: string) => {
  try {
    await connectToDatabase();
    const busDetails = await Bus.findById(id);
    if (!busDetails) return { data: "Bus not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(busDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateBus = async (req: ICreateUpdateParams, id: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await Bus.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const deleteBus = async (id: string, path: string) => {
  try {
    await connectToDatabase();
    const response = await Bus.findByIdAndDelete(id);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
