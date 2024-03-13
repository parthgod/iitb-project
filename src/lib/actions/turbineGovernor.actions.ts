"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import TurbineGovernor from "../database/models/turbineGovernorColumns";
import { IColumn, ICreateUpdateParams, ITurbineGovernor } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";

export const getAllTurbineGovernors = async (
  limit = 10,
  page = 1,
  query = "",
  columns: IColumn[]
): Promise<{
  data: ITurbineGovernor[];
  status: number;
  totalPages: number;
  totalDocuments: number;
  completeData: ITurbineGovernor[];
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
    const turbineGovernors = await TurbineGovernor.find(query ? conditions : {})
      .skip(skipAmount)
      .limit(limit);
    const totalDocuments = await TurbineGovernor.countDocuments(query ? conditions : {});
    const completeData = await TurbineGovernor.find(query ? conditions : {});
    return {
      data: JSON.parse(JSON.stringify(turbineGovernors)),
      status: 200,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments: totalDocuments,
      completeData: JSON.parse(JSON.stringify(completeData)),
    };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createTurbineGovernor = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newTurbineGovernor = new TurbineGovernor({
      ...defaultFields,
      additionalFields,
    });
    await newTurbineGovernor.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Turbine Governor",
      operationType: "Create",
      date: new Date(),
      document: {
        id: newTurbineGovernor._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    const createTurbineGovernorWithId = await TurbineGovernor.findByIdAndUpdate(newTurbineGovernor._id, {
      id: newTurbineGovernor._id.toString(),
    });

    return { data: JSON.parse(JSON.stringify(createTurbineGovernorWithId)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getTurbineGovernorById = async (id: string) => {
  try {
    await connectToDatabase();
    const turbineGovernorDetails = await TurbineGovernor.findById(id);
    if (!turbineGovernorDetails) return { data: "TurbineGovernor not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(turbineGovernorDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateTurbineGovernor = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await TurbineGovernor.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });

    const documentAfterChange = await TurbineGovernor.findById(id);

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Turbine Governor",
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

export const deleteTurbineGovernor = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await TurbineGovernor.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Turbine Governor",
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
