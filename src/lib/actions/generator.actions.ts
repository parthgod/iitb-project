"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import Generator from "../database/models/generator";
import { IColumn, ICreateUpdateParams, IDefaultParamSchema, IGenerator } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";
import DefaultParam from "../database/models/defaultParams";
import Bus from "../database/models/bus";
import { createBus } from "./bus.actions";

export const getAllGenerators = async (
  limit = 20,
  page = 1,
  query = "",
  columns: IColumn[]
): Promise<{
  data: IGenerator[];
  status: number;
  totalPages: number;
  totalDocuments: number;
  completeData: IGenerator[];
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
    const generators = await Generator.find(query ? conditions : {})
      .skip(skipAmount)
      .limit(limit);
    const totalDocuments = await Generator.countDocuments(query ? conditions : {});
    const completeData = await Generator.find(query ? conditions : {});
    return {
      data: JSON.parse(JSON.stringify(generators)),
      status: 200,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments: totalDocuments,
      completeData: JSON.parse(JSON.stringify(completeData)),
    };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createGenerator = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();

    const existingBus = await Bus.findOne({ busName: defaultFields.busTo });
    if (!existingBus) {
      const newBusDetails = {
        busName: defaultFields.busTo,
        location: defaultFields.location,
        nominalKV: defaultFields.kv,
      };
      await createBus({ defaultFields: newBusDetails, additionalFields: {} }, userId);
    }

    const newGenerator = new Generator({
      ...defaultFields,
      additionalFields,
    });
    await newGenerator.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Generator",
      operationType: "Create",
      date: new Date(),
      message: `New record with ID <span style="font-weight: 610">${newGenerator._id}</span> was added to <span style="font-weight: 610">Generator</span>.`,
      document: {
        id: newGenerator._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    return { data: JSON.parse(JSON.stringify(newGenerator)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getGeneratorById = async (id: string) => {
  try {
    await connectToDatabase();
    const generatorDetails = await Generator.findById(id);
    if (!generatorDetails) return { data: "Generator not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(generatorDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateGenerator = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();

    const existingBus = await Bus.findOne({ busName: defaultFields.busTo });
    if (!existingBus) {
      const newBusDetails = {
        busName: defaultFields.busTo,
        location: defaultFields.location,
        nominalKV: defaultFields.kv,
      };
      await createBus({ defaultFields: newBusDetails, additionalFields: {} }, userId);
    }

    const response = await Generator.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    const updatedResponse = await Generator.findById(id);

    const params: IDefaultParamSchema[] = await DefaultParam.find();
    const fields = params[0].generatorColumns;

    const documentBeforeChange = JSON.parse(JSON.stringify(response));
    const documentAfterChange = JSON.parse(JSON.stringify(updatedResponse));

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Generator",
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

export const deleteGenerator = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await Generator.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Generator",
        operationType: "Delete",
        date: new Date(),
        message: `Record with ID <span style="font-weight: 610">${response._id}</span> was deleted from <span style="font-weight: 610">Generator</span>.`,
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

export const uploadGeneratorFromExcel = async (data: any, userId: string) => {
  try {
    await connectToDatabase();
    const response = await Generator.insertMany(data);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Generator",
        operationType: "Create",
        date: new Date(),
        message: `<span style="font-weight: 610">${data.length}</span> records were added to <span style="font-weight: 610">Generator</span> from an excel file.`,
        document: {
          documentAfterChange: `${data.length}`,
        },
      };
      await ModificationHistory.create(modificationHistory);
      return { data: `${data.length} were records uploaded successfully to Generator`, status: 200 };
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const toggleGeneratorSwitchValue = async (id: string, column: IColumn, userId: string, value: "ON" | "OFF") => {
  try {
    await connectToDatabase();
    let response;
    if (column.isDefault) {
      response = await Generator.findByIdAndUpdate(id, { [column.field]: value });
    } else {
      const originalGenerator = await Generator.findById(id);
      const additionalFields = { ...originalGenerator.additionalFields, [column.field]: value };
      response = await Generator.findByIdAndUpdate(id, additionalFields);
    }
    let modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Generator",
      operationType: "Update",
      date: new Date(),
      message: `<span style="font-weight: 610">${column.title}'s</span> switch status was set to <span style="font-weight: 610">${value}</span> for record <span style="font-weight: 610">${id}</span> in <span style="font-weight: 610">Generator</span> table`,
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

export const deleteManyGenerator = async (recordsToDelete: string[], userId: string, path: string) => {
  try {
    await connectToDatabase();

    const response = await Generator.deleteMany({ _id: { $in: recordsToDelete } });
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Generator",
        operationType: "Delete",
        date: new Date(),
        message: `<span style="font-weight: 610">${recordsToDelete.length}</span> records were deleted from <span style="font-weight: 610">Generator</span>.`,
        document: {
          documentAfterChange: `${recordsToDelete.length}`,
        },
      };
      await ModificationHistory.create(modificationHistory);
      revalidatePath(path);
      return { data: `${recordsToDelete.length} records were deleted successfully from Generator.`, status: 200 };
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
