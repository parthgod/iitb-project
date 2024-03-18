"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import { INonDefaultDatabases, IColumn, ICreateUpdateParams } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";
import LCCHVDCLink from "../database/models/lccHVDCLink";

export const getAllLCCHVDCLinks = async (
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
    const lccHcdvLink = await LCCHVDCLink.find(query ? conditions : {})
      .skip(skipAmount)
      .limit(limit);
    const totalDocuments = await LCCHVDCLink.countDocuments(query ? conditions : {});
    const completeData = await LCCHVDCLink.find(query ? conditions : {});
    return {
      data: JSON.parse(JSON.stringify(lccHcdvLink)),
      status: 200,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments: totalDocuments,
      completeData: JSON.parse(JSON.stringify(completeData)),
    };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createLCCHVDCLink = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newLCCHVDCLink = new LCCHVDCLink({
      ...defaultFields,
      additionalFields,
    });
    await newLCCHVDCLink.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "LCC-HVDC Link",
      operationType: "Create",
      date: new Date(),
      document: {
        id: newLCCHVDCLink._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    const createLCCHVDCLinkWithId = await LCCHVDCLink.findByIdAndUpdate(newLCCHVDCLink._id, {
      id: newLCCHVDCLink._id.toString(),
    });

    return { data: JSON.parse(JSON.stringify(createLCCHVDCLinkWithId)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getLCCHVDCLinkById = async (id: string) => {
  try {
    await connectToDatabase();
    const vscHcdvLinkDetails = await LCCHVDCLink.findById(id);
    if (!vscHcdvLinkDetails) return { data: "LCC-HVDC Link not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(vscHcdvLinkDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateLCCHVDCLink = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await LCCHVDCLink.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    const documentAfterChange = await LCCHVDCLink.findById(id);

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "LCC-HVDC Link",
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

export const deleteLCCHVDCLink = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await LCCHVDCLink.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "LCC-HVDC Link",
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
