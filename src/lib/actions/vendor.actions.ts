"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import Vendor from "../database/models/vendor";
import { handleError } from "../../utils/helperFunctions";

export const getAllVendors = async () => {
  try {
    await connectToDatabase();
    const vendors = await Vendor.find({});
    return { data: JSON.parse(JSON.stringify(vendors)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const createVendor = async (req: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const alreadyExists = await Vendor.findOne({ vendorId: defaultFields.vendorId });
    if (alreadyExists) return { data: "Vendor already exists", status: 409 };
    const newVendor = new Vendor({
      ...defaultFields,
      additionalFields,
    });
    await newVendor.save();
    return { data: JSON.parse(JSON.stringify(newVendor)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const getVendorById = async (vendorId: any) => {
  try {
    await connectToDatabase();
    const vendorDetails = await Vendor.findOne({ vendorId: vendorId });
    if (!vendorDetails) return { data: "Vendor not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(vendorDetails)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const updateVendor = async (req: any, vendorId: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await Vendor.findByIdAndUpdate(vendorId, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const deleteVendor = async (vendorId: any, path: any) => {
  try {
    await connectToDatabase();
    const response = await Vendor.findByIdAndDelete(vendorId);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    handleError(error);
  }
};
