import DefaultParam, { IDefaultParamSchema } from "@/models/defaultParams";
import { connectToDatabase } from "@/utils/database";

export const POST = async (req: Request) => {
  try {
    await connectToDatabase();
    const newDefaultParams = new DefaultParam();
    await newDefaultParams.save();
    return new Response(JSON.stringify(newDefaultParams), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to create a new defaultParams", { status: 500 });
  }
};

export const GET = async () => {
  try {
    await connectToDatabase();
    const defaultParams = await DefaultParam.find();
    return new Response(JSON.stringify(defaultParams), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to get defaultParams", { status: 500 });
  }
};

export const PATCH = async (req: Request) => {
  const { columnName, columnType, columnField } = await req.json();
  console.log(columnName, columnType);
  try {
    await connectToDatabase();
    const oldParams: IDefaultParamSchema[] = await DefaultParam.find();
    const newColumns = {
      field: columnField,
      title: columnName,
      type: columnType,
      isDefault: false,
    };
    const newParams = oldParams[0];
    newParams.vendorColumns.push(newColumns);
    console.log(newParams);
    const newDefaultParams = await DefaultParam.findByIdAndUpdate(newParams._id, {
      vendorColumns: newParams.vendorColumns,
    });
    return new Response(JSON.stringify(newDefaultParams), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to edit defaultParams", { status: 500 });
  }
};
