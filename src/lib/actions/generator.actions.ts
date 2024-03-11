"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import Generator from "../database/models/generator";
import { ICreateUpdateParams, IGenerator } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";

export const getAllGenerators = async (): Promise<{ data: IGenerator[]; status: number }> => {
  try {
    await connectToDatabase();
    const generators = await Generator.find({});
    return { data: JSON.parse(JSON.stringify(generators)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createGenerator = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newGenerator = new Generator({
      ...defaultFields,
      additionalFields,
    });
    await newGenerator.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Generator",
      operationType: "Create",
      date: new Date(),
      document: {
        id: newGenerator._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    return { data: JSON.parse(JSON.stringify(newGenerator)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getGeneratorById = async (id: string) => {
  try {
    await connectToDatabase();
    const generatorDetails = await Generator.findById(id);
    if (!generatorDetails) return { data: "Generator not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(generatorDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateGenerator = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await Generator.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    const documentAfterChange = await Generator.findById(id);

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Generator",
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

export const deleteGenerator = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await Generator.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Generator",
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
