"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import TurbineGovernor from "../database/models/turbineGovernorColumns";
import { ICreateUpdateParams, ITurbineGovernor } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";

export const getAllTurbineGovernors = async (): Promise<{ data: ITurbineGovernor[]; status: number }> => {
  try {
    await connectToDatabase();
    const turbineGovernors = await TurbineGovernor.find({});
    return { data: JSON.parse(JSON.stringify(turbineGovernors)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createTurbineGovernor = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newTurbineGovernor = new TurbineGovernor({
      ...defaultFields,
      additionalFields,
    });
    await newTurbineGovernor.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Turbine Governor",
      operationType: "Create",
      date: new Date(),
      document: {
        id: newTurbineGovernor._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    return { data: JSON.parse(JSON.stringify(newTurbineGovernor)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getTurbineGovernorById = async (id: string) => {
  try {
    await connectToDatabase();
    const turbineGovernorDetails = await TurbineGovernor.findById(id);
    if (!turbineGovernorDetails) return { data: "TurbineGovernor not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(turbineGovernorDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateTurbineGovernor = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await TurbineGovernor.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });

    const documentAfterChange = await TurbineGovernor.findById(id);

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Turbine Governor",
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

export const deleteTurbineGovernor = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await TurbineGovernor.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Turbine Governor",
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
