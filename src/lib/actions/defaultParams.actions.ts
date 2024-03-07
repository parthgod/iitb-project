"use server";

import { connectToDatabase } from "../database/database";
import DefaultParam from "../database/models/defaultParams";
import { handleError } from "../../utils/helperFunctions";

export const getDefaultParams = async () => {
  try {
    await connectToDatabase();
    const defaultParams = await DefaultParam.find();
    return { data: JSON.parse(JSON.stringify(defaultParams)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const createDefaultParams = async () => {
  try {
    await connectToDatabase();
    const newDefaultParams = new DefaultParam();
    await newDefaultParams.save();
    return { data: JSON.parse(JSON.stringify(newDefaultParams)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};

export const updateDefaultParams = async (columnDetails: any, itemColumnName: string) => {
  const { columnName, columnType, columnField } = columnDetails;
  try {
    await connectToDatabase();
    const oldParams: any = await DefaultParam.find();
    const newColumns = {
      field: columnField,
      title: columnName,
      type: columnType,
      isDefault: false,
    };
    const newParams = oldParams[0];
    switch (itemColumnName) {
      case "/bus":
        newParams.busColumns.push(newColumns);
        break;

      case "/excitationSystem":
        newParams.excitationSystemColumns.push(newColumns);
        break;

      default:
        break;
    }
    const newDefaultParams = await DefaultParam.findByIdAndUpdate(newParams._id, {
      busColumns: newParams.busColumns,
      excitationSystemColumns: newParams.excitationSystemColumns,
    });
    return { data: JSON.parse(JSON.stringify(newDefaultParams)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};
