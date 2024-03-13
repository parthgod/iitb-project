"use server";

import { IChange } from "../../utils/defaultTypes";
import { connectToDatabase } from "../database/database";
import User from "../database/models/User";
import Changes from "../database/models/changes";
import { ObjectId } from "mongodb";

export const getAllRequests = async ({ query }: { query: string }): Promise<{ data: IChange[]; status: number }> => {
  try {
    await connectToDatabase();
    const conditions: any = {};
    if (query) {
      const user = await User.findOne({ name: { $regex: `.*${query}.*`, $options: "i" } });
      if (user) conditions.userId = user._id;
      else return { data: [], status: 200 };
    }
    const requests = await Changes.find(conditions).populate("user").sort({ date: -1 });
    return { data: JSON.parse(JSON.stringify(requests)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createRequest = async (req: { userId: string; message: string }) => {
  const { userId, message } = req;
  const id = new ObjectId(userId);
  const date = new Date();
  try {
    await connectToDatabase();
    const newRequest = new Changes({ user: id, message, date });
    await newRequest.save();
    return { data: JSON.parse(JSON.stringify(newRequest)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
