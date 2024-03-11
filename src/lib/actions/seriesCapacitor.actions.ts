"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import SeriesCapacitor from "../database/models/seriesCapacitor";
import { ICreateUpdateParams, ISeriesCapacitor } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";

export const getAllSeriesCapacitors = async (): Promise<{ data: ISeriesCapacitor[]; status: number }> => {
  try {
    await connectToDatabase();
    const seriesCapacitors = await SeriesCapacitor.find({});
    return { data: JSON.parse(JSON.stringify(seriesCapacitors)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createSeriesCapacitor = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newSeriesCapacitor = new SeriesCapacitor({
      ...defaultFields,
      additionalFields,
    });
    await newSeriesCapacitor.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Series Capacitor",
      operationType: "Create",
      date: new Date(),
      document: {
        id: newSeriesCapacitor._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

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

export const updateSeriesCapacitor = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await SeriesCapacitor.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });

    const documentAfterChange = await SeriesCapacitor.findById(id);

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Series Capacitor",
      operationType: "Update",
      date: new Date(),
      document: {
        id: id,
        documentBeforeChange: response,
        documentAfterChange: documentAfterChange,
      },
    };
    await ModificationHistory.create(modificationHistory);

    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const deleteSeriesCapacitor = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await SeriesCapacitor.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Series Capacitor",
        operationType: "Delete",
        date: new Date(),
        document: {
          id: id,
          documentBeforeChange: response,
        },
      };
      await ModificationHistory.create(modificationHistory);
      revalidatePath(path);
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
