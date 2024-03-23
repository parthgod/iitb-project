"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import TransformersThreeWinding from "../database/models/transformersThreeWinding";
import { IColumn, ICreateUpdateParams, ITransformersThreeWinding } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";

export const getAllTransformersThreeWindings = async (
  limit = 10,
  page = 1,
  query = "",
  columns: IColumn[]
): Promise<{
  data: ITransformersThreeWinding[];
  status: number;
  totalPages: number;
  totalDocuments: number;
  completeData: ITransformersThreeWinding[];
}> => {
  try {
    await connectToDatabase();
    const searchConditions: any = [];
    if (query) {
      columns.forEach((item) => {
        item.isDefault
          ? searchConditions.push({ [item.field]: { ["$regex"]: `.*${query}.*`, ["$options"]: "i" } })
          : searchConditions.push({
              [`additionalFields.${item.field}`]: { ["$regex"]: `.*${query}.*`, ["$options"]: "i" },
            });
      });
    }
    const conditions = {
      $or: [...searchConditions, { ["_id"]: ObjectId.isValid(query) ? new ObjectId(query) : null }],
    };
    const skipAmount = (Number(page) - 1) * limit;
    const transformersThreeWindings = await TransformersThreeWinding.find(query ? conditions : {})
      .skip(skipAmount)
      .limit(limit);
    const totalDocuments = await TransformersThreeWinding.countDocuments(query ? conditions : {});
    const completeData = await TransformersThreeWinding.find(query ? conditions : {});
    return {
      data: JSON.parse(JSON.stringify(transformersThreeWindings)),
      status: 200,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments: totalDocuments,
      completeData: JSON.parse(JSON.stringify(completeData)),
    };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createTransformersThreeWinding = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newTransformersThreeWinding = new TransformersThreeWinding({
      ...defaultFields,
      additionalFields,
    });
    await newTransformersThreeWinding.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Transformers Three Winding",
      operationType: "Create",
      date: new Date(),
      document: {
        id: newTransformersThreeWinding._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    const createTransformersThreeWindingWithId = await TransformersThreeWinding.findByIdAndUpdate(
      newTransformersThreeWinding._id,
      {
        id: newTransformersThreeWinding._id.toString(),
      }
    );

    return { data: JSON.parse(JSON.stringify(createTransformersThreeWindingWithId)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getTransformersThreeWindingById = async (id: string) => {
  try {
    await connectToDatabase();
    const transformersThreeWindingDetails = await TransformersThreeWinding.findById(id);
    if (!transformersThreeWindingDetails) return { data: "TransformersThreeWinding not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(transformersThreeWindingDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateTransformersThreeWinding = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await TransformersThreeWinding.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    const documentAfterChange = await TransformersThreeWinding.findById(id);

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Transformers Three Winding",
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

export const deleteTransformersThreeWinding = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await TransformersThreeWinding.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Transformers Three Winding",
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

export const uploadTransformersThreeWindingFromExcel = async (data: any, userId: string) => {
  try {
    await connectToDatabase();
    const response = await TransformersThreeWinding.insertMany(data);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Transformers Three Winding",
        operationType: "Create",
        date: new Date(),
        document: {
          documentAfterChange: `${data.length}`,
        },
      };
      await ModificationHistory.create(modificationHistory);
      return { data: `${data.length} were records uploaded successfully to Transformers Three Winding`, status: 200 };
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
