"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import TransmissionLine from "../database/models/transmissionLines";
import { ICreateUpdateParams, ITransmissionLine } from "../../utils/defaultTypes";

export const getAllTransmissionLines = async (): Promise<{ data: ITransmissionLine[]; status: number }> => {
  try {
    await connectToDatabase();
    const transmissionLines = await TransmissionLine.find({});
    return { data: JSON.parse(JSON.stringify(transmissionLines)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createTransmissionLine = async (req: ICreateUpdateParams) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newTransmissionLine = new TransmissionLine({
      ...defaultFields,
      additionalFields,
    });
    await newTransmissionLine.save();
    return { data: JSON.parse(JSON.stringify(newTransmissionLine)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getTransmissionLineById = async (id: string) => {
  try {
    await connectToDatabase();
    const transmissionLineDetails = await TransmissionLine.findById(id);
    if (!transmissionLineDetails) return { data: "TransmissionLine not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(transmissionLineDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateTransmissionLine = async (req: ICreateUpdateParams, id: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await TransmissionLine.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const deleteTransmissionLine = async (id: string, path: string) => {
  try {
    await connectToDatabase();
    const response = await TransmissionLine.findByIdAndDelete(id);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
