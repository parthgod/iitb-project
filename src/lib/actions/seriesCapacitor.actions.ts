"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import SeriesCapacitor from "../database/models/seriesCapacitor";
import { ICreateUpdateParams, ISeriesCapacitor } from "../../utils/defaultTypes";

export const getAllSeriesCapacitors = async (): Promise<{ data: ISeriesCapacitor[]; status: number }> => {
  try {
    await connectToDatabase();
    const seriesCapacitors = await SeriesCapacitor.find({});
    return { data: JSON.parse(JSON.stringify(seriesCapacitors)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createSeriesCapacitor = async (req: ICreateUpdateParams) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newSeriesCapacitor = new SeriesCapacitor({
      ...defaultFields,
      additionalFields,
    });
    await newSeriesCapacitor.save();
    return { data: JSON.parse(JSON.stringify(newSeriesCapacitor)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getSeriesCapacitorById = async (id: string) => {
  try {
    await connectToDatabase();
    const seriesCapacitorDetails = await SeriesCapacitor.findById(id);
    if (!seriesCapacitorDetails) return { data: "Series Capacitor not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(seriesCapacitorDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateSeriesCapacitor = async (req: ICreateUpdateParams, id: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await SeriesCapacitor.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const deleteSeriesCapacitor = async (id: string, path: string) => {
  try {
    await connectToDatabase();
    const response = await SeriesCapacitor.findByIdAndDelete(id);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
