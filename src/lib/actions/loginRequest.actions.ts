"use server";

import { ILoginRequest } from "../../utils/defaultTypes";
import { connectToDatabase } from "../database/database";
import LoginRequest from "../database/models/loginRequests";
import User from "../database/models/User";
import { createNewUser } from "./users.actions";

export const getAllLoginRequests = async (
  query: string,
  status: string
): Promise<{ data: ILoginRequest[]; status: number }> => {
  try {
    await connectToDatabase();
    const conditions: any = [];
    if (query) {
      conditions.push({ name: { $regex: `.*${query}.*`, $options: "i" } });
      conditions.push({ email: { $regex: `.*${query}.*`, $options: "i" } });
    }
    if (status) conditions.push({ status: { $regex: `.*${query}.*`, $options: "i" } });
    let searchConditions: any = {};
    if (conditions.length) searchConditions.$or = [...conditions];
    const requests = await LoginRequest.find(searchConditions);
    return { data: JSON.parse(JSON.stringify(requests)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createLoginRequest = async (data: any) => {
  try {
    // const { name, image, email } = data;
    await connectToDatabase();

    const doesUserExist = await User.findOne({ email: data.email });
    if (doesUserExist) {
      return { data: "User already exists. Try logging in instead", status: 403 };
    }

    const doesRequestExist = await LoginRequest.findOne({ email: data.email });
    if (doesRequestExist) {
      return {
        data: "Login request is already sent for this email. Please wait for admin's approval or use different email",
        status: 403,
      };
    }

    await LoginRequest.create(data);
    return { data: "Request sent successfully to admin. Please wait for admin's approval", status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateLoginRequestStatus = async (status: string, id: string) => {
  try {
    await connectToDatabase();
    if (status === "Rejected") {
      const response = await LoginRequest.findByIdAndUpdate(id, { status: status });
      return { data: `${response.name} has been rejected from accessing database.`, status: 200 };
    } else {
      const user = await LoginRequest.findByIdAndDelete(id);
      await createNewUser({ name: user.name, email: user.email });
      return { data: `${user.name} can now access the database.`, status: 200 };
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const deleteLoginRequest = async (id: string) => {
  try {
    await connectToDatabase();
    const response = await LoginRequest.findByIdAndDelete(id);
    return { data: `Login request for ${response.name} removed.`, status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
