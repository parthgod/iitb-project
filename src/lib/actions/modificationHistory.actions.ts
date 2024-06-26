"use server";

import { revalidatePath } from "next/cache";
import { IModificationHistory } from "../../utils/defaultTypes";
import { connectToDatabase } from "../database/database";
import User from "../database/models/User";
import ModificationHistory from "../database/models/modificationHistory";

export const getAllModificationsHistory = async ({
  type,
  databaseName,
  query,
  limit = 20,
  page = 1,
}: {
  type: string;
  databaseName: string;
  query: string;
  limit: number;
  page: number;
}): Promise<{
  data: IModificationHistory[];
  status: number;
  totalPages: number;
  totalDocuments: number;
  completeData: IModificationHistory[];
}> => {
  try {
    await connectToDatabase();

    const conditions: any = {};

    if (type) conditions.operationType = { $regex: type, $options: "i" };

    if (databaseName) conditions.databaseName = { $regex: databaseName, $options: "i" };

    if (query) {
      const user = await User.findOne({ name: { $regex: `.*${query}.*`, $options: "i" } });
      if (user) conditions.userId = user._id;
      else return { data: [], status: 200, totalDocuments: 0, totalPages: 0, completeData: [] };
    }

    const skipAmount = (Number(page) - 1) * limit;
    const response = await ModificationHistory.find(conditions)
      .populate("userId")
      .sort({ date: -1 })
      .skip(skipAmount)
      .limit(limit);
    const totalDocuments = await ModificationHistory.countDocuments(conditions);
    const completeData = await ModificationHistory.find({});

    return {
      data: JSON.parse(JSON.stringify(response)),
      status: 200,
      totalDocuments,
      totalPages: Math.ceil(totalDocuments / limit),
      completeData,
    };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const deleteModificationHistory = async (id: string) => {
  try {
    await connectToDatabase();
    const response = await ModificationHistory.findByIdAndDelete(id);
    return { data: "Modification history deleted successfully.", status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const deleteManyModificationHistory = async (recordsToDelete: string[], path: string) => {
  try {
    await connectToDatabase();

    const res = await ModificationHistory.deleteMany({ _id: { $in: recordsToDelete } });
    revalidatePath(path);
    return { data: `${recordsToDelete.length} modification history deleted successfully.`, status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
