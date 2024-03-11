"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import ShuntCapacitor from "../database/models/shuntCapacitor";
import { ICreateUpdateParams, IShuntCapacitor } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";

export const getAllShuntCapacitors = async (): Promise<{ data: IShuntCapacitor[]; status: number }> => {
  try {
    await connectToDatabase();
    const shuntCapacitors = await ShuntCapacitor.find({});
    return { data: JSON.parse(JSON.stringify(shuntCapacitors)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createShuntCapacitor = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newShuntCapacitor = new ShuntCapacitor({
      ...defaultFields,
      additionalFields,
    });
    await newShuntCapacitor.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Shunt Capacitor",
      operationType: "Create",
      date: new Date(),
      document: {
        id: newShuntCapacitor._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    return { data: JSON.parse(JSON.stringify(newShuntCapacitor)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getShuntCapacitorById = async (id: string) => {
  try {
    await connectToDatabase();
    const shuntCapacitorDetails = await ShuntCapacitor.findById(id);
    if (!shuntCapacitorDetails) return { data: "Shunt Capacitor not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(shuntCapacitorDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateShuntCapacitor = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await ShuntCapacitor.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    const documentAfterChange = await ShuntCapacitor.findById(id);

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Shunt Capacitor",
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

export const deleteShuntCapacitor = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await ShuntCapacitor.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Shunt Capacitor",
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
