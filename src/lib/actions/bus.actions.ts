"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import Bus from "../database/models/bus";
import { IBus, IColumn, ICreateUpdateParams } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";

export const getAllBuses = async (
  limit = 10,
  page = 1,
  query = "",
  columns: IColumn[]
): Promise<{ data: IBus[]; status: number; totalPages: number; totalDocuments: number; completeData: IBus[] }> => {
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
    const buses = await Bus.find(query ? conditions : {})
      .skip(skipAmount)
      .limit(limit);
    const totalDocuments = await Bus.countDocuments(query ? conditions : {});
    const completeData = await Bus.find(query ? conditions : {});
    return {
      data: JSON.parse(JSON.stringify(buses)),
      status: 200,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments: totalDocuments,
      completeData: JSON.parse(JSON.stringify(completeData)),
    };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createBus = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newBus = new Bus({
      ...defaultFields,
      additionalFields,
    });
    await newBus.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Bus",
      operationType: "Create",
      date: new Date(),
      document: {
        id: newBus._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    const createBusWithId = await Bus.findByIdAndUpdate(newBus._id, { id: newBus._id.toString() });

    return { data: JSON.parse(JSON.stringify(createBusWithId)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getBusById = async (id: string) => {
  try {
    await connectToDatabase();
    const busDetails = await Bus.findById(id);
    if (!busDetails) return { data: "Bus not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(busDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateBus = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await Bus.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    const documentAfterChange = await Bus.findById(id);

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Bus",
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

export const deleteBus = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await Bus.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Bus",
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

export const uploadBusFromExcel = async (data: any, userId: string) => {
  try {
    await connectToDatabase();
    const response = await Bus.insertMany(data);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Bus",
        operationType: "Create",
        date: new Date(),
        document: {
          documentAfterChange: `${data.length}`,
        },
      };
      await ModificationHistory.create(modificationHistory);
      return { data: `${data.length} were records uploaded successfully to Bus`, status: 200 };
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
