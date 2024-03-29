"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import { INonDefaultDatabases, IColumn, ICreateUpdateParams, IDefaultParamSchema } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";
import LCCHVDCLink from "../database/models/lccHVDCLink";
import DefaultParam from "../database/models/defaultParams";

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
      message: `New record with ID <span style="font-weight: 610">${newLCCHVDCLink._id}</span> was added to <span style="font-weight: 610">LCC-HVDC Link</span>.`,
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
    const updatedResponse = await LCCHVDCLink.findById(id);

    const params: IDefaultParamSchema[] = await DefaultParam.find();
    const fields = params[0].lccHVDCLinkColumns;

    const documentBeforeChange = JSON.parse(JSON.stringify(response));
    const documentAfterChange = JSON.parse(JSON.stringify(updatedResponse));

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "LCC-HVDC Link",
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
        message: `Record with ID <span style="font-weight: 610">${response._id}</span> was deleted from <span style="font-weight: 610">LCC-HVDC Link</span>.`,
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

export const uploadLCCHVDCLinkFromExcel = async (data: any, userId: string) => {
  try {
    await connectToDatabase();
    const response = await LCCHVDCLink.insertMany(data);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "LCC-HVDC Link",
        operationType: "Create",
        date: new Date(),
        message: `<span style="font-weight: 610">${data.length}</span> records were added to LCC-HVDC Link from an excel file.`,
        document: {
          documentAfterChange: `${data.length}`,
        },
      };
      await ModificationHistory.create(modificationHistory);
      return { data: `${data.length} were records uploaded successfully to LCC-HVDC Link`, status: 200 };
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
