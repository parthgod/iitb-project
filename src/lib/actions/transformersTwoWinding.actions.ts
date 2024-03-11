"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import TransformersTwoWinding from "../database/models/transformersTwoWinding";
import { ICreateUpdateParams, ITransformersTwoWinding } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";

export const getAllTransformersTwoWindings = async (): Promise<{ data: ITransformersTwoWinding[]; status: number }> => {
  try {
    await connectToDatabase();
    const transformersTwoWindings = await TransformersTwoWinding.find({});
    return { data: JSON.parse(JSON.stringify(transformersTwoWindings)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createTransformersTwoWinding = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newTransformersTwoWinding = new TransformersTwoWinding({
      ...defaultFields,
      additionalFields,
    });
    await newTransformersTwoWinding.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Transformers Two Winding",
      operationType: "Create",
      date: new Date(),
      document: {
        id: newTransformersTwoWinding._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    return { data: JSON.parse(JSON.stringify(newTransformersTwoWinding)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getTransformersTwoWindingById = async (id: string) => {
  try {
    await connectToDatabase();
    const transformersTwoWindingDetails = await TransformersTwoWinding.findById(id);
    if (!transformersTwoWindingDetails) return { data: "TransformersTwoWinding not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(transformersTwoWindingDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateTransformersTwoWinding = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await TransformersTwoWinding.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    const documentAfterChange = await TransformersTwoWinding.findById(id);

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Transformers Two Winding",
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

export const deleteTransformersTwoWinding = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await TransformersTwoWinding.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Transformers Two Winding",
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
