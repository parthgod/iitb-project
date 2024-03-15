"use server";

import { IModificationHistory } from "../../utils/defaultTypes";
import { connectToDatabase } from "../database/database";
import User from "../database/models/User";
import ModificationHistory from "../database/models/modificationHistory";

export const getAllModificationsHistory = async ({
  type,
  databaseName,
  query,
}: {
  type: string;
  databaseName: string;
  query: string;
}): Promise<{ data: IModificationHistory[]; status: number; totalDocuments: number }> => {
  try {
    await connectToDatabase();
    const conditions: any = {};
    if (type) conditions.operationType = { $regex: type, $options: "i" };
    if (databaseName) conditions.databaseName = { $regex: databaseName, $options: "i" };
    if (query) {
      const user = await User.findOne({ name: { $regex: `.*${query}.*`, $options: "i" } });
      if (user) conditions.userId = user._id;
      else return { data: [], status: 200, totalDocuments: 0 };
    }

    const response = await ModificationHistory.find(conditions).populate("userId").sort({ date: -1 });
    const totalDocuments = await ModificationHistory.countDocuments(conditions);
    return { data: JSON.parse(JSON.stringify(response)), status: 200, totalDocuments };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
