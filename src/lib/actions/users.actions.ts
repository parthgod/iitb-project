"use server";

import { IUser } from "@/utils/defaultTypes";
import { connectToDatabase } from "../database/database";
import User from "../database/models/User";
import bcryptjs from "bcryptjs";

export const createNewUser = async (req: {
  name: string;
  email: string;
}): Promise<{ data: string; status: number }> => {
  try {
    await connectToDatabase();
    const { name, email } = req;
    if (!name || !email) {
      return { data: "Missing Fields", status: 400 };
    }

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return { data: "User already exists. Try logging in instead", status: 403 };
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash("12345", salt);
    const savedUser = await new User({ name, email, password: hashedPassword }).save();

    return { data: "User created successfully", status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const changePassword = async (req: {
  id: string;
  password: string;
}): Promise<{ data: string; status: number }> => {
  try {
    await connectToDatabase();
    const { id, password } = req;
    const user = await User.findById(id);

    if (!user) return { data: "User not found", status: 404 };
    const salt = await bcryptjs.genSalt(10);
    const isSamePassword = await bcryptjs.compare(password, user?.password);
    if (isSamePassword) return { data: "Password is same as before. Please use a different password", status: 500 };

    const hashedPassword = await bcryptjs.hash(password, salt);

    const updatedUser = await User.findByIdAndUpdate(id, { password: hashedPassword });
    return { data: "Password changed successfully.", status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getAllUsers = async ({
  query,
  status,
}: {
  query: string;
  status: string;
}): Promise<{ data: IUser[]; status: number }> => {
  try {
    await connectToDatabase();
    const conditions: any = [];
    if (query) {
      conditions.push({ name: { $regex: `.*${query}.*`, $options: "i" } });
      conditions.push({ email: { $regex: `.*${query}.*`, $options: "i" } });
    }
    if (status) conditions.push({ disabled: status === "disabled" ? true : false });
    let searchConditions: any = {};
    if (conditions.length) searchConditions.$or = [...conditions];
    const users = await User.find({ ...searchConditions, isAdmin: false });
    return { data: JSON.parse(JSON.stringify(users)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateUserStatus = async (userId: string, disabled: boolean) => {
  try {
    await connectToDatabase();
    const updatedUser = await User.findByIdAndUpdate(userId, { disabled: disabled });
    return { data: "User status changed successfully.", status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createAdmin = async (req: any) => {
  try {
    await connectToDatabase();
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(req.password, salt);
    await User.create({ ...req, password: hashedPassword });
    return { status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
