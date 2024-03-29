"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import SeriesCapacitor from "../database/models/seriesCapacitor";
import { IColumn, ICreateUpdateParams, IDefaultParamSchema, ISeriesCapacitor } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";
import DefaultParam from "../database/models/defaultParams";

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
      message: `New record with ID <span style="font-weight: 610">${newSeriesCapacitor._id}</span> was added to <span style="font-weight: 610">Series Capacitor</span>.`,
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
    const updatedResponse = await SeriesCapacitor.findById(id);

    const params: IDefaultParamSchema[] = await DefaultParam.find();
    const fields = params[0].seriesCapacitorColumns;

    const documentBeforeChange = JSON.parse(JSON.stringify(response));
    const documentAfterChange = JSON.parse(JSON.stringify(updatedResponse));

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Series Capacitor",
      operationType: "Update",
      date: new Date(),
      message: `Record with ID <span style="font-weight: 610">${id}</span> was updated. Field${fields
        .map((item) => {
          if (documentBeforeChange.hasOwnProperty(item.field) && documentAfterChange.hasOwnProperty(item.field)) {
            if (documentBeforeChange[item.field] !== documentAfterChange[item.field]) {
              if (item.type === "image") return ` <span style="font-weight: 610">${item.title}</span> was changed,`;
              return ` <span style="font-weight: 610">${
                item.title
              }</span> was changed from <span style="font-weight: 610">${
                documentBeforeChange[item.field]
              }</span> to <span style="font-weight: 610">${documentAfterChange[item.field]},</span>`;
            }
            return null;
          } else if (
            documentBeforeChange?.additionalFields.hasOwnProperty(item.field) &&
            documentAfterChange?.additionalFields.hasOwnProperty(item.field)
          ) {
            if (
              documentBeforeChange.additionalFields[item.field] !== documentAfterChange.additionalFields[item.field]
            ) {
              if (item.type === "image") return ` <span style="font-weight: 610">${item.title}</span> was changed, `;
              return ` <span style="font-weight: 610">${item.title}</span> was changed from{" "}
              <span style="font-weight: 610">${
                documentBeforeChange.additionalFields[item.field]
              }</span> to <span style="font-weight: 610">${documentAfterChange.additionalFields[item.field]},</span>`;
            }
            return null;
          } else {
            return ` <span style="font-weight: 610">${item.title}</span> was updated to <span style="font-weight: 610">
              ${documentBeforeChange?.[item.field] || documentAfterChange.additionalFields?.[item.field]},
            </span>`;
          }
        })
        .filter(Boolean)
        .join(" ")}`,
      document: {
        id: id,
        documentBeforeChange: documentBeforeChange,
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
        message: `Record with ID <span style="font-weight: 610">${response._id}</span> was deleted from <span style="font-weight: 610">Series Capacitor</span>.`,
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

export const uploadSeriesCapacitorFromExcel = async (data: any, userId: string) => {
  try {
    await connectToDatabase();
    const response = await SeriesCapacitor.insertMany(data);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Series Capacitor",
        operationType: "Create",
        date: new Date(),
        message: `<span style="font-weight: 610">${data.length}</span> records were added to Series Capacitor from an excel file.`,
        document: {
          documentAfterChange: `${data.length}`,
        },
      };
      await ModificationHistory.create(modificationHistory);
      return { data: `${data.length} were records uploaded successfully to Series Capacitor`, status: 200 };
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
