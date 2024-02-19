"use server";

import { handleError } from "../../utils/helperFunctions";
import { connectToDatabase } from "../database/database";
import Changes from "../database/models/changes";
import { ObjectId } from "mongodb";

export const getAllRequests = async () => {
  try {
    await connectToDatabase();
    const requests = await Changes.find().populate("user");
    return { data: JSON.parse(JSON.stringify(requests)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const createRequest = async (req: any) => {
  const { userId, message } = req;
  const id = new ObjectId(userId);
  try {
    await connectToDatabase();
    const newRequest = new Changes({ user: id, message: message });
    await newRequest.save();
    return { data: JSON.parse(JSON.stringify(newRequest)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};
