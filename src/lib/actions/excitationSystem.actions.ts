"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import ExcitationSystem from "../database/models/excitationSystem";
import { IColumn, ICreateUpdateParams, IDefaultParamSchema, IExcitationSystem } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";
import DefaultParam from "../database/models/defaultParams";

export const getAllExcitationSystems = async (
  limit = 10,
  page = 1,
  query = "",
  columns: IColumn[]
): Promise<{
  data: IExcitationSystem[];
  status: number;
  totalPages: number;
  totalDocuments: number;
  completeData: IExcitationSystem[];
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
    const excitationSystems = await ExcitationSystem.find(query ? conditions : {})
      .skip(skipAmount)
      .limit(limit);
    const totalDocuments = await ExcitationSystem.countDocuments(query ? conditions : {});
    const completeData = await ExcitationSystem.find(query ? conditions : {});
    return {
      data: JSON.parse(JSON.stringify(excitationSystems)),
      status: 200,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments: totalDocuments,
      completeData: JSON.parse(JSON.stringify(completeData)),
    };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createExcitationSystem = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newExcitationSystem = new ExcitationSystem({
      ...defaultFields,
      additionalFields,
    });
    await newExcitationSystem.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Excitation System",
      operationType: "Create",
      date: new Date(),
      message: `New record with ID <span style="font-weight: 610">${newExcitationSystem._id}</span> was added to <span style="font-weight: 610">Excitation System</span>.`,
      document: {
        id: newExcitationSystem._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    const createExcitationSystemWithId = await ExcitationSystem.findByIdAndUpdate(newExcitationSystem._id, {
      id: newExcitationSystem._id.toString(),
    });

    return { data: JSON.parse(JSON.stringify(createExcitationSystemWithId)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getExcitationSystemById = async (id: string) => {
  try {
    await connectToDatabase();
    const excitationSystemDetails = await ExcitationSystem.findById(id);
    if (!excitationSystemDetails) return { data: "Excitation system not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(excitationSystemDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateExcitationSystem = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await ExcitationSystem.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    const updatedResponse = await ExcitationSystem.findById(id);

    const params: IDefaultParamSchema[] = await DefaultParam.find();
    const fields = params[0].excitationSystemColumns;

    const documentBeforeChange = JSON.parse(JSON.stringify(response));
    const documentAfterChange = JSON.parse(JSON.stringify(updatedResponse));

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Excitation System",
      operationType: "Update",
      date: new Date(),
      message: `Record with ID <span style="font-weight: 610">${id}</span> was updated. Field${fields
        .map((item) => {
          if (documentBeforeChange?.hasOwnProperty(item.field) && documentAfterChange?.hasOwnProperty(item.field)) {
            if (documentBeforeChange[item.field] !== documentAfterChange[item.field]) {
              if (item.type === "image")
                return ` <span style="font-weight: 610">${item.title}'s</span> image was changed,`;
              return ` <span style="font-weight: 610">${
                item.title
              }</span> was changed from <span style="font-weight: 610">${
                documentBeforeChange[item.field]
              }</span> to <span style="font-weight: 610">${documentAfterChange[item.field]},</span>`;
            }
            return null;
          } else if (
            documentBeforeChange?.additionalFields?.hasOwnProperty(item.field) &&
            documentAfterChange?.additionalFields?.hasOwnProperty(item.field)
          ) {
            if (
              documentBeforeChange.additionalFields[item.field] !== documentAfterChange.additionalFields[item.field]
            ) {
              if (item.type === "image")
                return ` <span style="font-weight: 610">${item.title}'s</span> image was changed, `;
              return ` <span style="font-weight: 610">${item.title}</span> was changed from{" "}
              <span style="font-weight: 610">${
                documentBeforeChange.additionalFields[item.field]
              }</span> to <span style="font-weight: 610">${documentAfterChange.additionalFields[item.field]},</span>`;
            }
            return null;
          } else {
            if (item.type === "image")
              return ` <span style="font-weight: 610">${item.title}'s</span> image was changed,`;
            return ` <span style="font-weight: 610">${item.title}</span> was updated to <span style="font-weight: 610">
              ${documentBeforeChange?.[item.field] || documentAfterChange?.additionalFields?.[item.field]},
            </span>`;
          }
        })
        .filter(Boolean)
        .join(" ")}.`,
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

export const deleteExcitationSystem = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await ExcitationSystem.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Excitation System",
        operationType: "Delete",
        date: new Date(),
        message: `Record with ID <span style="font-weight: 610">${response._id}</span> was deleted from <span style="font-weight: 610">Excitation System</span>.`,
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

export const uploadExcitationSystemFromExcel = async (data: any, userId: string) => {
  try {
    await connectToDatabase();
    const response = await ExcitationSystem.insertMany(data);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Excitation System",
        operationType: "Create",
        date: new Date(),
        message: `<span style="font-weight: 610">${data.length}</span> records were added to <span style="font-weight: 610">Excitation System</span> from an excel file.`,
        document: {
          documentAfterChange: `${data.length}`,
        },
      };
      await ModificationHistory.create(modificationHistory);
      return { data: `${data.length} were records uploaded successfully to Excitation System`, status: 200 };
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const toggleExcitationSystemSwitchValue = async (
  id: string,
  column: IColumn,
  userId: string,
  value: "ON" | "OFF"
) => {
  try {
    await connectToDatabase();
    let response;
    if (column.isDefault) {
      response = await ExcitationSystem.findByIdAndUpdate(id, { [column.field]: value });
    } else {
      const originalExcitationSystem = await ExcitationSystem.findById(id);
      const additionalFields = { ...originalExcitationSystem.additionalFields, [column.field]: value };
      response = await ExcitationSystem.findByIdAndUpdate(id, additionalFields);
    }
    let modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Excitation System",
      operationType: "Update",
      date: new Date(),
      message: `<span style="font-weight: 610">${column.title}'s</span> switch status was set to <span style="font-weight: 610">${value}</span> for record <span style="font-weight: 610">${id}</span> in <span style="font-weight: 610">Excitation System</span> table`,
      document: {
        documentAfterChange: response,
      },
    };
    await ModificationHistory.create(modificationHistory);
    return { data: "Status changed successfully.", status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
