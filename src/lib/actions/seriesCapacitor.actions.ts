"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import SeriesCapacitor from "../database/models/seriesCapacitor";
import { IColumn, ICreateUpdateParams, ISeriesCapacitor } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";

export const getAllSeriesCapacitors = async (
  limit = 10,
  page = 1,
  query = "",
  columns: IColumn[]
): Promise<{
  data: ISeriesCapacitor[];
  status: number;
  totalPages: number;
  totalDocuments: number;
  completeData: ISeriesCapacitor[];
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
    const seriesCapacitors = await SeriesCapacitor.find(query ? conditions : {})
      .skip(skipAmount)
      .limit(limit);
    const totalDocuments = await SeriesCapacitor.countDocuments(query ? conditions : {});
    const completeData = await SeriesCapacitor.find(query ? conditions : {});
    return {
      data: JSON.parse(JSON.stringify(seriesCapacitors)),
      status: 200,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments: totalDocuments,
      completeData: JSON.parse(JSON.stringify(completeData)),
    };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createSeriesCapacitor = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newSeriesCapacitor = new SeriesCapacitor({
      ...defaultFields,
      additionalFields,
    });
    await newSeriesCapacitor.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Series Capacitor",
      operationType: "Create",
      date: new Date(),
      document: {
        id: newSeriesCapacitor._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    const createSeriesCapacitorWithId = await SeriesCapacitor.findByIdAndUpdate(newSeriesCapacitor._id, {
      id: newSeriesCapacitor._id.toString(),
    });

    return { data: JSON.parse(JSON.stringify(createSeriesCapacitorWithId)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getSeriesCapacitorById = async (id: string) => {
  try {
    await connectToDatabase();
    const seriesCapacitorDetails = await SeriesCapacitor.findById(id);
    if (!seriesCapacitorDetails) return { data: "Series Capacitor not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(seriesCapacitorDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateSeriesCapacitor = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await SeriesCapacitor.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });

    const documentAfterChange = await SeriesCapacitor.findById(id);

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Series Capacitor",
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

export const deleteSeriesCapacitor = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await SeriesCapacitor.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Series Capacitor",
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
