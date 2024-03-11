"use server";

import { IModificationHistory } from "../../utils/defaultTypes";
import { connectToDatabase } from "../database/database";
import ModificationHistory from "../database/models/modificationHistory";

export const getAllModificationsHistory = async (
  dbName?: string
): Promise<{ data: IModificationHistory[]; status: number }> => {
  try {
    await connectToDatabase();
    const response = await ModificationHistory.find(dbName ? { databaseName: dbName } : {})
      .populate("userId")
      .sort({ date: -1 });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
