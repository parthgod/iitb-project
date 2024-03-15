"use server";

import { connectToDatabase } from "../database/database";
import User from "../database/models/User";
import bcryptjs from "bcryptjs";

export const createNewUser = async (req: {
  name: string;
  email: string;
  password: string;
}): Promise<{ data: string; status: number }> => {
  try {
    await connectToDatabase();
    const { name, email, password } = req;
    if (!name || !email || !password) {
      return { data: "Missing Fields", status: 400 };
    }

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return { data: "User already exists. Try logging in instead", status: 403 };
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
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
