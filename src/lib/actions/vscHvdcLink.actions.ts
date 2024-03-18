"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import { INonDefaultDatabases, IColumn, ICreateUpdateParams } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";
import VSCHVDCLink from "../database/models/vscHVDCLink";

export const getAllVSCHVDCLinks = async (
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
    const vscHcdvLink = await VSCHVDCLink.find(query ? conditions : {})
      .skip(skipAmount)
      .limit(limit);
    const totalDocuments = await VSCHVDCLink.countDocuments(query ? conditions : {});
    const completeData = await VSCHVDCLink.find(query ? conditions : {});
    return {
      data: JSON.parse(JSON.stringify(vscHcdvLink)),
      status: 200,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments: totalDocuments,
      completeData: JSON.parse(JSON.stringify(completeData)),
    };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createVSCHVDCLink = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newVSCHVDCLink = new VSCHVDCLink({
      ...defaultFields,
      additionalFields,
    });
    await newVSCHVDCLink.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "VSC-HVDC Link",
      operationType: "Create",
      date: new Date(),
      document: {
        id: newVSCHVDCLink._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    const createVSCHVDCLinkWithId = await VSCHVDCLink.findByIdAndUpdate(newVSCHVDCLink._id, {
      id: newVSCHVDCLink._id.toString(),
    });

    return { data: JSON.parse(JSON.stringify(createVSCHVDCLinkWithId)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getVSCHVDCLinkById = async (id: string) => {
  try {
    await connectToDatabase();
    const vscHcdvLinkDetails = await VSCHVDCLink.findById(id);
    if (!vscHcdvLinkDetails) return { data: "VSC-HVDC Link not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(vscHcdvLinkDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateVSCHVDCLink = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await VSCHVDCLink.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    const documentAfterChange = await VSCHVDCLink.findById(id);

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "VSC-HVDC Link",
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

export const deleteVSCHVDCLink = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await VSCHVDCLink.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "VSC-HVDC Link",
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
