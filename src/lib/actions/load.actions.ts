"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import Load from "../database/models/load";
import { ICreateUpdateParams, ILoad } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";

export const getAllLoads = async (): Promise<{ data: ILoad[]; status: number }> => {
  try {
    await connectToDatabase();
    const loads = await Load.find({});
    return { data: JSON.parse(JSON.stringify(loads)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createLoad = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newLoad = new Load({
      ...defaultFields,
      additionalFields,
    });
    await newLoad.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Load",
      operationType: "Create",
      date: new Date(),
      document: {
        id: newLoad._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    return { data: JSON.parse(JSON.stringify(newLoad)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getLoadById = async (id: string) => {
  try {
    await connectToDatabase();
    const loadDetails = await Load.findById(id);
    if (!loadDetails) return { data: "Load not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(loadDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateLoad = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await Load.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });

    const documentAfterChange = await Load.findById(id);

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Load",
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

export const deleteLoad = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await Load.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Load",
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
