"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import { handleError } from "../../utils/helperFunctions";
import Warehouse from "../database/models/warehouse";

export const getAllWarehouses = async () => {
  try {
    await connectToDatabase();
    const warehouses = await Warehouse.find({});
    return { data: JSON.parse(JSON.stringify(warehouses)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const createWarehouse = async (req: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const alreadyExists = await Warehouse.findOne({ warehouseId: defaultFields.warehouseId });
    if (alreadyExists) return { data: "Warehouse already exists", status: 409 };
    const newWarehouse = new Warehouse({
      ...defaultFields,
      additionalFields,
    });
    await newWarehouse.save();
    return { data: JSON.parse(JSON.stringify(newWarehouse)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const getWarehouseById = async (warehouseId: any) => {
  try {
    await connectToDatabase();
    const warehouseDetails = await Warehouse.findOne({ warehouseId: warehouseId });
    if (!warehouseDetails) return { data: "Warehouse not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(warehouseDetails)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const updateWarehouse = async (req: any, warehouseId: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await Warehouse.findByIdAndUpdate(warehouseId, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const deleteWarehouse = async (warehouseId: any, path: any) => {
  try {
    await connectToDatabase();
    const response = await Warehouse.findByIdAndDelete(warehouseId);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    handleError(error);
  }
};
