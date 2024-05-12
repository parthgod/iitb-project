"use server";

import { IRequest } from "../../utils/defaultTypes";
import { connectToDatabase } from "../database/database";
import User from "../database/models/User";
import DataRequest from "../database/models/dataRequest";
import { ObjectId } from "mongodb";

export const getAllDataRequests = async ({
  query,
  status,
  limit = 20,
  page = 1,
}: {
  query: string;
  status: string;
  limit: number;
  page: number;
}): Promise<{ data: IRequest[]; status: number; totalPages: number; totalDocuments: number }> => {
  try {
    await connectToDatabase();

    const conditions: any = {};

    if (query) {
      const user = await User.findOne({ name: { $regex: `.*${query}.*`, $options: "i" } });
      if (user) conditions.user = user._id;
      else return { data: [], status: 200, totalDocuments: 0, totalPages: 0 };
    }

    if (status) conditions.status = status;

    const skipAmount = (Number(page) - 1) * limit;
    const requests = await DataRequest.find(conditions)
      .populate("user")
      .sort({ date: -1 })
      .skip(skipAmount)
      .limit(limit);
    const totalDocuments = await DataRequest.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(requests)),
      status: 200,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments: totalDocuments,
    };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createDataRequest = async (req: { userId: string; message: string }) => {
  const { userId, message } = req;
  const id = new ObjectId(userId);
  const date = new Date();
  try {
    await connectToDatabase();
    const newRequest = new DataRequest({ user: id, message, date });
    await newRequest.save();
    return { data: JSON.parse(JSON.stringify(newRequest)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateDataRequest = async ({ status, id }: { status: boolean; id: string }) => {
  try {
    await connectToDatabase();
    const request = await DataRequest.findById(id);
    if (!request) return { data: "Request not found", status: 404 };
    const req = await DataRequest.findByIdAndUpdate(id, { status: status ? "Completed" : "Rejected" });
    return { data: JSON.parse(JSON.stringify(req)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const deleteDataRequest = async (id: string) => {
  try {
    await connectToDatabase();
    const response = await DataRequest.findByIdAndDelete(id);
    return { data: "Request deleted successfully", status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
