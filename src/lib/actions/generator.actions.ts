"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import { handleError } from "../../utils/helperFunctions";
import Generator from "../database/models/generator";

export const getAllGenerators = async () => {
  try {
    await connectToDatabase();
    const generators = await Generator.find({});
    return { data: JSON.parse(JSON.stringify(generators)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const createGenerator = async (req: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newGenerator = new Generator({
      ...defaultFields,
      additionalFields,
    });
    await newGenerator.save();
    return { data: JSON.parse(JSON.stringify(newGenerator)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const getGeneratorById = async (id: any) => {
  try {
    await connectToDatabase();
    const generatorDetails = await Generator.findById(id);
    if (!generatorDetails) return { data: "Generator not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(generatorDetails)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const updateGenerator = async (req: any, id: any) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await Generator.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const deleteGenerator = async (id: any, path: any) => {
  try {
    await connectToDatabase();
    const response = await Generator.findByIdAndDelete(id);
    if (response) {
      revalidatePath(path);
    }
  } catch (error) {
    handleError(error);
  }
};
