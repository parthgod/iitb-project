"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import ShuntReactor from "../database/models/shuntReactor";
import { ICreateUpdateParams, IShuntReactor } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";

export const getAllShuntReactors = async (): Promise<{ data: IShuntReactor[]; status: number }> => {
  try {
    await connectToDatabase();
    const shuntReactors = await ShuntReactor.find({});
    return { data: JSON.parse(JSON.stringify(shuntReactors)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createShuntReactor = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newShuntReactor = new ShuntReactor({
      ...defaultFields,
      additionalFields,
    });
    await newShuntReactor.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Shunt Reactor",
      operationType: "Create",
      date: new Date(),
      document: {
        id: newShuntReactor._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    return { data: JSON.parse(JSON.stringify(newShuntReactor)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getShuntReactorById = async (id: string) => {
  try {
    await connectToDatabase();
    const shuntReactorDetails = await ShuntReactor.findById(id);
    if (!shuntReactorDetails) return { data: "ShuntReactor not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(shuntReactorDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateShuntReactor = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await ShuntReactor.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    const documentAfterChange = await ShuntReactor.findById(id);

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Shunt Reactor",
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

export const deleteShuntReactor = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await ShuntReactor.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Shunt Reactor",
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
