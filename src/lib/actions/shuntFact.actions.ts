"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import { INonDefaultDatabases, IColumn, ICreateUpdateParams } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";
import ShuntFact from "../database/models/shuntFact";

export const getAllShuntFacts = async (
  limit = 10,
  page = 1,
  query = "",
  columns: IColumn[]
): Promise<{
  data: INonDefaultDatabases[];
  status: number;
  totalPages: number;
  totalDocuments: number;
  completeData: INonDefaultDatabases[];
}> => {
  try {
    await connectToDatabase();
    const searchConditions: any = [];
    if (query)
      columns.forEach((item) => {
        if (item.type === "subColumns") {
          item.subColumns?.map((subItem) => {
            searchConditions.push({
              [`additionalFields.${item.field}.${subItem.field}`]: {
                ["$regex"]: `.*${query}.*`,
                ["$options"]: "i",
              },
            });
          });
        } else
          searchConditions.push({
            [`additionalFields.${item.field}`]: { ["$regex"]: `.*${query}.*`, ["$options"]: "i" },
          });
      });
    const conditions = {
      $or: [...searchConditions, { ["id"]: query }],
    };
    const skipAmount = (Number(page) - 1) * limit;
    const shuntFacts = await ShuntFact.find(query ? conditions : {})
      .skip(skipAmount)
      .limit(limit);
    const totalDocuments = await ShuntFact.countDocuments(query ? conditions : {});
    const completeData = await ShuntFact.find(query ? conditions : {});
    return {
      data: JSON.parse(JSON.stringify(shuntFacts)),
      status: 200,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments: totalDocuments,
      completeData: JSON.parse(JSON.stringify(completeData)),
    };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createShuntFact = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newShuntFact = new ShuntFact({
      ...defaultFields,
      additionalFields,
    });
    await newShuntFact.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "ShuntFact",
      operationType: "Create",
      date: new Date(),
      document: {
        id: newShuntFact._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    const createShuntFactWithId = await ShuntFact.findByIdAndUpdate(newShuntFact._id, {
      id: newShuntFact._id.toString(),
    });

    return { data: JSON.parse(JSON.stringify(createShuntFactWithId)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getShuntFactById = async (id: string) => {
  try {
    await connectToDatabase();
    const shuntFactDetails = await ShuntFact.findById(id);
    if (!shuntFactDetails) return { data: "Shunt Fact not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(shuntFactDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateShuntFact = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await ShuntFact.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    const documentAfterChange = await ShuntFact.findById(id);

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "ShuntFact",
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

export const deleteShuntFact = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await ShuntFact.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "ShuntFact",
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
