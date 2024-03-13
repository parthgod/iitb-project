"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import TransformersTwoWinding from "../database/models/transformersTwoWinding";
import { IColumn, ICreateUpdateParams, ITransformersTwoWinding } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";

export const getAllTransformersTwoWindings = async (
  limit = 10,
  page = 1,
  query = "",
  columns: IColumn[]
): Promise<{
  data: ITransformersTwoWinding[];
  status: number;
  totalPages: number;
  totalDocuments: number;
  completeData: ITransformersTwoWinding[];
}> => {
  try {
    await connectToDatabase();
    const searchConditions: any = [];
    if (query)
      columns.forEach((item) => {
        if (item.type === "subColumns") {
          item.subColumns?.map((subItem) => {
            item.isDefault
              ? searchConditions.push({
                  [`${item.field}.${subItem.field}`]: { ["$regex"]: `.*${query}.*`, ["$options"]: "i" },
                })
              : searchConditions.push({
                  [`additionalFields.${item.field}.${subItem.field}`]: {
                    ["$regex"]: `.*${query}.*`,
                    ["$options"]: "i",
                  },
                });
          });
        } else
          item.isDefault
            ? searchConditions.push({ [item.field]: { ["$regex"]: `.*${query}.*`, ["$options"]: "i" } })
            : searchConditions.push({
                [`additionalFields.${item.field}`]: { ["$regex"]: `.*${query}.*`, ["$options"]: "i" },
              });
      });
    const conditions = {
      $or: [...searchConditions, { ["id"]: query }],
    };
    const skipAmount = (Number(page) - 1) * limit;
    const transformersTwoWindings = await TransformersTwoWinding.find(query ? conditions : {})
      .skip(skipAmount)
      .limit(limit);
    const totalDocuments = await TransformersTwoWinding.countDocuments(query ? conditions : {});
    const completeData = await TransformersTwoWinding.find(query ? conditions : {});
    return {
      data: JSON.parse(JSON.stringify(transformersTwoWindings)),
      status: 200,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments: totalDocuments,
      completeData: JSON.parse(JSON.stringify(completeData)),
    };
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

    const createTransformersTwoWindingWithId = await TransformersTwoWinding.findByIdAndUpdate(
      newTransformersTwoWinding._id,
      {
        id: newTransformersTwoWinding._id.toString(),
      }
    );

    return { data: JSON.parse(JSON.stringify(createTransformersTwoWindingWithId)), status: 200 };
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
