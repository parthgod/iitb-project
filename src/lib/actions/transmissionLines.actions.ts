"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import { handleError } from "../../utils/helperFunctions";
import TransmissionLine from "../database/models/transmissionLines";

export const getAllTransmissionLines = async () => {
  try {
    await connectToDatabase();
    const transmissionLines = await TransmissionLine.find({});
    return { data: JSON.parse(JSON.stringify(transmissionLines)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const createTransmissionLine = async (req: any) => {
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
    handleError(error);
  }
};

export const getTransmissionLineById = async (id: any) => {
  try {
    await connectToDatabase();
    const transmissionLineDetails = await TransmissionLine.findById(id);
    if (!transmissionLineDetails) return { data: "TransmissionLine not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(transmissionLineDetails)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const updateTransmissionLine = async (req: any, id: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await TransmissionLine.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const deleteTransmissionLine = async (id: any, path: any) => {
  try {
    await connectToDatabase();
    const response = await TransmissionLine.findByIdAndDelete(id);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    handleError(error);
  }
};
