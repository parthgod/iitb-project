"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import TransmissionLine from "../database/models/transmissionLines";
import { IColumn, ICreateUpdateParams, IDefaultParamSchema, ITransmissionLine } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";
import DefaultParam from "../database/models/defaultParams";
import Bus from "../database/models/bus";
import { createBus } from "./bus.actions";

export const getAllTransmissionLines = async (
  limit = 20,
  page = 1,
  query = "",
  columns: IColumn[]
): Promise<{
  data: ITransmissionLine[];
  status: number;
  totalPages: number;
  totalDocuments: number;
  completeData: ITransmissionLine[];
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
    const transmissionLines = await TransmissionLine.find(query ? conditions : {})
      .skip(skipAmount)
      .limit(limit);
    const totalDocuments = await TransmissionLine.countDocuments(query ? conditions : {});
    const completeData = await TransmissionLine.find(query ? conditions : {});
    return {
      data: JSON.parse(JSON.stringify(transmissionLines)),
      status: 200,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments: totalDocuments,
      completeData: JSON.parse(JSON.stringify(completeData)),
    };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createTransmissionLine = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();

    const busFrom = await Bus.findOne({ busName: defaultFields.busFrom });
    if (!busFrom) {
      const newBusDetails = {
        busName: defaultFields.busFrom,
        location: defaultFields.location1,
        nominalKV: defaultFields.kv,
      };
      await createBus({ defaultFields: newBusDetails, additionalFields: {} }, userId);
    }

    const newTransmissionLine = new TransmissionLine({
      ...defaultFields,
      additionalFields,
    });
    await newTransmissionLine.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Transmission Line",
      operationType: "Create",
      date: new Date(),
      message: `New record with ID <span style="font-weight: 610">${newTransmissionLine._id}</span> was added to <span style="font-weight: 610">Transmission Line</span>.`,
      document: {
        id: newTransmissionLine._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    return { data: JSON.parse(JSON.stringify(newTransmissionLine)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getTransmissionLineById = async (id: string) => {
  try {
    await connectToDatabase();
    const transmissionLineDetails = await TransmissionLine.findById(id);
    if (!transmissionLineDetails) return { data: "TransmissionLine not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(transmissionLineDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateTransmissionLine = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();

    const busFrom = await Bus.findOne({ busName: defaultFields.busFrom });
    if (!busFrom) {
      const newBusDetails = {
        busName: defaultFields.busFrom,
        location: defaultFields.location1,
        nominalKV: defaultFields.kv,
      };
      await createBus({ defaultFields: newBusDetails, additionalFields: {} }, userId);
    }

    const response = await TransmissionLine.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    const updatedResponse = await TransmissionLine.findById(id);

    const params: IDefaultParamSchema[] = await DefaultParam.find();
    const fields = params[0].transmissionLinesColumns;

    const documentBeforeChange = JSON.parse(JSON.stringify(response));
    const documentAfterChange = JSON.parse(JSON.stringify(updatedResponse));

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Transmission Line",
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

export const deleteTransmissionLine = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await TransmissionLine.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Transmission Line",
        operationType: "Delete",
        date: new Date(),
        message: `Record with ID <span style="font-weight: 610">${response._id}</span> was deleted from <span style="font-weight: 610">Transmission Line</span>.`,
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

export const uploadTransmissionLineFromExcel = async (data: any, userId: string) => {
  try {
    await connectToDatabase();
    const response = await TransmissionLine.insertMany(data);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Transmission Line",
        operationType: "Create",
        date: new Date(),
        message: `<span style="font-weight: 610">${data.length}</span> records were added to <span style="font-weight: 610">Transmission Line</span> from an excel file.`,
        document: {
          documentAfterChange: `${data.length}`,
        },
      };
      await ModificationHistory.create(modificationHistory);
      return { data: `${data.length} were records uploaded successfully to Transmission Line`, status: 200 };
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const toggleTransmissionLineSwitchValue = async (
  id: string,
  column: IColumn,
  userId: string,
  value: "ON" | "OFF"
) => {
  try {
    await connectToDatabase();
    let response;
    if (column.isDefault) {
      response = await TransmissionLine.findByIdAndUpdate(id, { [column.field]: value });
    } else {
      const originalTransmissionLine = await TransmissionLine.findById(id);
      const additionalFields = { ...originalTransmissionLine.additionalFields, [column.field]: value };
      response = await TransmissionLine.findByIdAndUpdate(id, additionalFields);
    }
    let modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Transmission Line",
      operationType: "Update",
      date: new Date(),
      message: `<span style="font-weight: 610">${column.title}'s</span> switch status was set to <span style="font-weight: 610">${value}</span> for record <span style="font-weight: 610">${id}</span> in <span style="font-weight: 610">Transmission Line</span> table`,
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

export const deleteManyTransmissionLine = async (recordsToDelete: string[], userId: string, path: string) => {
  try {
    await connectToDatabase();

    const response = await TransmissionLine.deleteMany({ _id: { $in: recordsToDelete } });
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Transmission Line",
        operationType: "Delete",
        date: new Date(),
        message: `<span style="font-weight: 610">${recordsToDelete.length}</span> records were deleted from <span style="font-weight: 610">Transmission Line</span>.`,
        document: {
          documentAfterChange: `${recordsToDelete.length}`,
        },
      };
      await ModificationHistory.create(modificationHistory);
      revalidatePath(path);
      return {
        data: `${recordsToDelete.length} records were deleted successfully from Transmission Line.`,
        status: 200,
      };
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
