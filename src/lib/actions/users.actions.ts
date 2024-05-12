"use server";

import { IUser } from "../../utils/defaultTypes";
import { connectToDatabase } from "../database/database";
import User from "../database/models/User";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { passwordResetEmail } from "../../utils/emailHtmlTemplate";
import { ObjectId } from "mongodb";

export const createNewUser = async (req: {
  name: string;
  email: string;
  image: string;
}): Promise<{ data: string; status: number }> => {
  try {
    await connectToDatabase();
    const { name, email, image } = req;
    if (!name || !email) {
      return { data: "Missing Fields", status: 400 };
    }

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return { data: "User already exists. Try logging in instead", status: 403 };
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash("12345", salt);
    const savedUser = await new User({ name, email, password: hashedPassword, image: image }).save();

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
    if (isSamePassword) return { data: "Password is same as before. Please use a different password.", status: 500 };

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
  limit = 20,
  page = 1,
  userId,
}: {
  query: string;
  status: string;
  limit: number;
  page: number;
  userId: string;
}): Promise<{ data: IUser[]; status: number; totalPages: number; totalDocuments: number }> => {
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

    const skipAmount = (Number(page) - 1) * limit;
    const users = await User.find({ ...searchConditions, _id: { $ne: userId } })
      .skip(skipAmount)
      .limit(limit);
    const totalDocuments = await User.countDocuments({ ...searchConditions, _id: { $ne: userId } });

    return {
      data: JSON.parse(JSON.stringify(users)),
      status: 200,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments: totalDocuments,
    };
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

export const deleteUser = async (id: string) => {
  try {
    await connectToDatabase();
    const response = await User.findByIdAndDelete(id);
    return { data: `User '${response.name}' has been permanently removed from the application.`, status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const resetPassword = async (email: string) => {
  try {
    await connectToDatabase();

    const user = await User.findOne({ email: email });

    if (!user) return { data: "User with this email address does not exist.", status: 404 };

    const token = crypto.randomBytes(32).toString("hex");
    const currentTime = new Date();
    const expirationTime = new Date(currentTime.getTime() + 30 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, { resetPasswordToken: token, resetPasswordExpiry: expirationTime });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "parthgenius.gps@gmail.com",
        pass: "szktlhaxuvxzehco",
      },
    });

    const mailOptions = {
      from: "VoltVault <parthgenius.gps@gmail.com>",
      to: user.email,
      subject: "Reset your password",
      text: "Email content",
      html: passwordResetEmail(`${process.env.BASE_URL}/resetPassword/${user._id}?token=${token}`),
    };

    const response = await transporter.sendMail(mailOptions);

    return { data: "Email sent successfully", status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getUserById = async (id: string): Promise<{ data: IUser | null; status: number }> => {
  try {
    await connectToDatabase();
    if (!ObjectId.isValid(id)) {
      return { data: null, status: 404 };
    }
    const user = await User.findById(id);

    if (!user) return { data: null, status: 404 };

    return { data: JSON.parse(JSON.stringify(user)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const toggleUserAdminStatus = async (id: string, adminStatus: boolean) => {
  try {
    await connectToDatabase();
    const user = await User.findByIdAndUpdate(id, { isAdmin: adminStatus });
    return {
      data: adminStatus ? `User ${user.name} is now an admin.` : `User ${user.name} is no longer an admin.`,
      status: 200,
    };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
