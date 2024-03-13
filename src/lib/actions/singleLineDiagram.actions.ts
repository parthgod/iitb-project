"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import SingleLineDiagram from "../database/models/singleLineDiagram";
import { IColumn, ICreateUpdateParams, ISingleLineDiagram } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";

export const getAllSingleLineDiagrams = async (
  limit = 10,
  page = 1,
  query = "",
  columns: IColumn[]
): Promise<{
  data: ISingleLineDiagram[];
  status: number;
  totalPages: number;
  totalDocuments: number;
  completeData: ISingleLineDiagram[];
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
    const singleLineDiagrams = await SingleLineDiagram.find(query ? conditions : {})
      .skip(skipAmount)
      .limit(limit);
    const totalDocuments = await SingleLineDiagram.countDocuments(query ? conditions : {});
    const completeData = await SingleLineDiagram.find(query ? conditions : {});
    return {
      data: JSON.parse(JSON.stringify(singleLineDiagrams)),
      status: 200,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments: totalDocuments,
      completeData: JSON.parse(JSON.stringify(completeData)),
    };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createSingleLineDiagram = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newSingleLineDiagram = new SingleLineDiagram({
      ...defaultFields,
      additionalFields,
    });
    await newSingleLineDiagram.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Single Line Diagram",
      operationType: "Create",
      date: new Date(),
      document: {
        id: newSingleLineDiagram._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    const createSingleLineDiagramWithId = await SingleLineDiagram.findByIdAndUpdate(newSingleLineDiagram._id, {
      id: newSingleLineDiagram._id.toString(),
    });

    return { data: JSON.parse(JSON.stringify(createSingleLineDiagramWithId)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getSingleLineDiagramById = async (id: string) => {
  try {
    await connectToDatabase();
    const singleLineDiagramDetails = await SingleLineDiagram.findById(id);
    if (!singleLineDiagramDetails) return { data: "SingleLineDiagram not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(singleLineDiagramDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateSingleLineDiagram = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await SingleLineDiagram.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    const documentAfterChange = await SingleLineDiagram.findById(id);

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Single Line Diagram",
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

export const deleteSingleLineDiagram = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await SingleLineDiagram.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Single Line Diagram",
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
