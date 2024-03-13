"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import { INonDefaultDatabases, IColumn, ICreateUpdateParams } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";
import IBR from "../database/models/ibr";

export const getAllIBRs = async (
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
    const ibrs = await IBR.find(query ? conditions : {})
      .skip(skipAmount)
      .limit(limit);
    const totalDocuments = await IBR.countDocuments(query ? conditions : {});
    const completeData = await IBR.find(query ? conditions : {});
    return {
      data: JSON.parse(JSON.stringify(ibrs)),
      status: 200,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments: totalDocuments,
      completeData: JSON.parse(JSON.stringify(completeData)),
    };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createIBR = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newIBR = new IBR({
      ...defaultFields,
      additionalFields,
    });
    await newIBR.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "IBR",
      operationType: "Create",
      date: new Date(),
      document: {
        id: newIBR._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    const createIBRWithId = await IBR.findByIdAndUpdate(newIBR._id, { id: newIBR._id.toString() });

    return { data: JSON.parse(JSON.stringify(createIBRWithId)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getIBRById = async (id: string) => {
  try {
    await connectToDatabase();
    const ibrDetails = await IBR.findById(id);
    if (!ibrDetails) return { data: "IBR not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(ibrDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateIBR = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await IBR.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    const documentAfterChange = await IBR.findById(id);

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "IBR",
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

export const deleteIBR = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await IBR.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "IBR",
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
