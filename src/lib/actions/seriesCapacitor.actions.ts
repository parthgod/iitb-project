"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import { handleError } from "../../utils/helperFunctions";
import SeriesCapacitor from "../database/models/seriesCapacitor";

export const getAllSeriesCapacitors = async () => {
  try {
    await connectToDatabase();
    const seriesCapacitors = await SeriesCapacitor.find({});
    return { data: JSON.parse(JSON.stringify(seriesCapacitors)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const createSeriesCapacitor = async (req: any) => {
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
    handleError(error);
  }
};

export const getSeriesCapacitorById = async (id: any) => {
  try {
    await connectToDatabase();
    const seriesCapacitorDetails = await SeriesCapacitor.findById(id);
    if (!seriesCapacitorDetails) return { data: "Series Capacitor not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(seriesCapacitorDetails)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const updateSeriesCapacitor = async (req: any, id: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await SeriesCapacitor.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const deleteSeriesCapacitor = async (id: any, path: any) => {
  try {
    await connectToDatabase();
    const response = await SeriesCapacitor.findByIdAndDelete(id);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    handleError(error);
  }
};
