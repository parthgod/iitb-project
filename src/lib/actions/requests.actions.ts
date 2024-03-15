"use server";

import { IRequest } from "../../utils/defaultTypes";
import { connectToDatabase } from "../database/database";
import User from "../database/models/User";
import Requests from "../database/models/request";
import { ObjectId } from "mongodb";

export const getAllRequests = async ({
  query,
  status,
}: {
  query: string;
  status?: string;
}): Promise<{ data: IRequest[]; status: number }> => {
  try {
    await connectToDatabase();
    const conditions: any = {};
    if (query) {
      const user = await User.findOne({ name: { $regex: `.*${query}.*`, $options: "i" } });
      if (user) conditions.user = user._id;
      else return { data: [], status: 200 };
    }
    if (status) conditions.status = status;
    const requests = await Requests.find(conditions).populate("user").sort({ date: -1 });
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
    const newRequest = new Requests({ user: id, message, date });
    await newRequest.save();
    return { data: JSON.parse(JSON.stringify(newRequest)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateRequest = async ({ status, id }: { status: boolean; id: string }) => {
  try {
    await connectToDatabase();
    const request = await Requests.findById(id);
    if (!request) return { data: "Request not found", status: 404 };
    const req = await Requests.findByIdAndUpdate(id, { status: status ? "Completed" : "Rejected" });
    return { data: JSON.parse(JSON.stringify(req)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
