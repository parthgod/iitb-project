"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import ExcitationSystem from "../database/models/excitationSystem";
import { ICreateUpdateParams, IExcitationSystem } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";

export const getAllExcitationSystems = async (): Promise<{ data: IExcitationSystem[]; status: number }> => {
  try {
    await connectToDatabase();
    const excitationSystems = await ExcitationSystem.find({});
    return { data: JSON.parse(JSON.stringify(excitationSystems)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createExcitationSystem = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newExcitationSystem = new ExcitationSystem({
      ...defaultFields,
      additionalFields,
    });
    await newExcitationSystem.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Excitation System",
      operationType: "Create",
      date: new Date(),
      document: {
        id: newExcitationSystem._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    return { data: JSON.parse(JSON.stringify(newExcitationSystem)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getExcitationSystemById = async (id: string) => {
  try {
    await connectToDatabase();
    const excitationSystemDetails = await ExcitationSystem.findById(id);
    if (!excitationSystemDetails) return { data: "Excitation system not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(excitationSystemDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateExcitationSystem = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await ExcitationSystem.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    const documentAfterChange = await ExcitationSystem.findById(id);

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Excitation System",
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

export const deleteExcitationSystem = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await ExcitationSystem.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Excitation System",
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
