"use server";

import { loginAcceptEmailHTML } from "../../utils/loginRequestEmailHTML";
import { ILoginRequest } from "../../utils/defaultTypes";
import { connectToDatabase } from "../database/database";
import LoginRequest from "../database/models/loginRequests";
import User from "../database/models/User";
import { createNewUser } from "./users.actions";
import nodemailer from "nodemailer";

export const getAllLoginRequests = async ({
  query,
  status,
  limit = 10,
  page = 1,
}: {
  query: string;
  status: string;
  limit: number;
  page: number;
}): Promise<{ data: ILoginRequest[]; status: number; totalPages: number; totalDocuments: number }> => {
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

    const skipAmount = (Number(page) - 1) * limit;
    const requests = await LoginRequest.find(searchConditions).skip(skipAmount).limit(limit);
    const totalDocuments = await LoginRequest.countDocuments(searchConditions);

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

export const createLoginRequest = async (data: any) => {
  try {
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
      await createNewUser({ name: user.name, email: user.email, image: user.image });

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
        from: "Power Systems <parthgenius.gps@gmail.com>",
        to: user.email,
        subject: "Login Request approved for Power Systems",
        text: "Email content",
        html: loginAcceptEmailHTML({ email: user.email }),
      };

      const data = await transporter.sendMail(mailOptions);

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
    return { data: `Login request for '${response.name}' removed.`, status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
