"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import { INonDefaultDatabases, IColumn, ICreateUpdateParams } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";
import SeriesFact from "../database/models/seriesFact";

export const getAllSeriesFacts = async (
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
    const seriesFacts = await SeriesFact.find(query ? conditions : {})
      .skip(skipAmount)
      .limit(limit);
    const totalDocuments = await SeriesFact.countDocuments(query ? conditions : {});
    const completeData = await SeriesFact.find(query ? conditions : {});
    return {
      data: JSON.parse(JSON.stringify(seriesFacts)),
      status: 200,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments: totalDocuments,
      completeData: JSON.parse(JSON.stringify(completeData)),
    };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createSeriesFact = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newSeriesFact = new SeriesFact({
      ...defaultFields,
      additionalFields,
    });
    await newSeriesFact.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Series Fact",
      operationType: "Create",
      date: new Date(),
      document: {
        id: newSeriesFact._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    const createSeriesFactWithId = await SeriesFact.findByIdAndUpdate(newSeriesFact._id, {
      id: newSeriesFact._id.toString(),
    });

    return { data: JSON.parse(JSON.stringify(createSeriesFactWithId)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getSeriesFactById = async (id: string) => {
  try {
    await connectToDatabase();
    const seriesFactDetails = await SeriesFact.findById(id);
    if (!seriesFactDetails) return { data: "Series Fact not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(seriesFactDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateSeriesFact = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await SeriesFact.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    const documentAfterChange = await SeriesFact.findById(id);

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Series Fact",
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

export const deleteSeriesFact = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await SeriesFact.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Series Fact",
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
