"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import ShuntReactor from "../database/models/shuntReactor";
import { IColumn, ICreateUpdateParams, IShuntReactor } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";

export const getAllShuntReactors = async (
  limit = 10,
  page = 1,
  query = "",
  columns: IColumn[]
): Promise<{
  data: IShuntReactor[];
  status: number;
  totalPages: number;
  totalDocuments: number;
  completeData: IShuntReactor[];
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
    const shuntReactors = await ShuntReactor.find(query ? conditions : {})
      .skip(skipAmount)
      .limit(limit);
    const totalDocuments = await ShuntReactor.countDocuments(query ? conditions : {});
    const completeData = await ShuntReactor.find(query ? conditions : {});
    return {
      data: JSON.parse(JSON.stringify(shuntReactors)),
      status: 200,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments: totalDocuments,
      completeData: JSON.parse(JSON.stringify(completeData)),
    };
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

    const createShuntReactorWithId = await ShuntReactor.findByIdAndUpdate(newShuntReactor._id, {
      id: newShuntReactor._id.toString(),
    });

    return { data: JSON.parse(JSON.stringify(createShuntReactorWithId)), status: 200 };
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
