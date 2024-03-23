"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import TransmissionLine from "../database/models/transmissionLines";
import { IColumn, ICreateUpdateParams, ITransmissionLine } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";

export const getAllTransmissionLines = async (
  limit = 10,
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
      document: {
        id: newTransmissionLine._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    const createTransmissionLineWithId = await TransmissionLine.findByIdAndUpdate(newTransmissionLine._id, {
      id: newTransmissionLine._id.toString(),
    });

    return { data: JSON.parse(JSON.stringify(createTransmissionLineWithId)), status: 200 };
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
    const response = await TransmissionLine.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    const documentAfterChange = await TransmissionLine.findById(id);

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Transmission Line",
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
