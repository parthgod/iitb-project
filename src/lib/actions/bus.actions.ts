"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import Bus from "../database/models/bus";
import { IBus, IColumn, ICreateUpdateParams, IDefaultParamSchema } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";
import DefaultParam from "../database/models/defaultParams";

export const getAllBuses = async (
  limit = 10,
  page = 1,
  query = "",
  columns: IColumn[]
): Promise<{ data: IBus[]; status: number; totalPages: number; totalDocuments: number; completeData: IBus[] }> => {
  try {
    await connectToDatabase();
    const searchConditions: any = [];
    if (query) {
      columns.forEach((item) => {
        item.isDefault
          ? searchConditions.push({ [item.field]: { ["$regex"]: `.*${query}.*`, ["$options"]: "i" } })
          : searchConditions.push({
              [`additionalFields.${item.field}`]: { ["$regex"]: `.*${query}.*`, ["$options"]: "i" },
            });
      });
    }
    const conditions = {
      $or: [...searchConditions, { ["_id"]: ObjectId.isValid(query) ? new ObjectId(query) : null }],
    };
    const skipAmount = (Number(page) - 1) * limit;
    const buses = await Bus.find(query ? conditions : {})
      .skip(skipAmount)
      .limit(limit);
    const totalDocuments = await Bus.countDocuments(query ? conditions : {});
    const completeData = await Bus.find(query ? conditions : {});
    return {
      data: JSON.parse(JSON.stringify(buses)),
      status: 200,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments: totalDocuments,
      completeData: JSON.parse(JSON.stringify(completeData)),
    };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createBus = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newBus = new Bus({
      ...defaultFields,
      additionalFields,
    });
    await newBus.save();

    let modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Bus",
      operationType: "Create",
      date: new Date(),
      message: `New record with ID <span style="font-weight: 610">${newBus._id}</span> was added to <span style="font-weight: 610">Bus</span>.`,
      document: {
        id: newBus._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    const createBusWithId = await Bus.findByIdAndUpdate(newBus._id, { id: newBus._id.toString() });

    return { data: JSON.parse(JSON.stringify(createBusWithId)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getBusById = async (id: string) => {
  try {
    await connectToDatabase();
    const busDetails = await Bus.findById(id);
    if (!busDetails) return { data: "Bus not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(busDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateBus = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await Bus.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    const updatedResponse = await Bus.findById(id);

    const params: IDefaultParamSchema[] = await DefaultParam.find();
    const fields = params[0].busColumns;

    const documentBeforeChange = JSON.parse(JSON.stringify(response));
    const documentAfterChange = JSON.parse(JSON.stringify(updatedResponse));

    let modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Bus",
      operationType: "Update",
      date: new Date(),
      message: `Record with ID <span style="font-weight: 610">${id}</span> was updated. Field${fields
        .map((item) => {
          if (documentBeforeChange?.hasOwnProperty(item.field) && documentAfterChange?.hasOwnProperty(item.field)) {
            if (documentBeforeChange[item.field] !== documentAfterChange[item.field]) {
              if (item.type === "image")
                return ` <span style="font-weight: 610">${item.title}'s</span> image was changed,`;
              return ` <span style="font-weight: 610">${
                item.title
              }</span> was changed from <span style="font-weight: 610">${
                documentBeforeChange[item.field]
              }</span> to <span style="font-weight: 610">${documentAfterChange[item.field]},</span>`;
            }
            return null;
          } else if (
            documentBeforeChange?.additionalFields?.hasOwnProperty(item.field) &&
            documentAfterChange?.additionalFields?.hasOwnProperty(item.field)
          ) {
            if (
              documentBeforeChange.additionalFields[item.field] !== documentAfterChange.additionalFields[item.field]
            ) {
              if (item.type === "image")
                return ` <span style="font-weight: 610">${item.title}'s</span> image was changed, `;
              return ` <span style="font-weight: 610">${item.title}</span> was changed from{" "}
              <span style="font-weight: 610">${
                documentBeforeChange.additionalFields[item.field]
              }</span> to <span style="font-weight: 610">${documentAfterChange.additionalFields[item.field]},</span>`;
            }
            return null;
          } else {
            if (item.type === "image")
              return ` <span style="font-weight: 610">${item.title}'s</span> image was changed,`;
            return ` <span style="font-weight: 610">${item.title}</span> was updated to <span style="font-weight: 610">
              ${documentBeforeChange?.[item.field] || documentAfterChange?.additionalFields?.[item.field]},
            </span>`;
          }
        })
        .filter(Boolean)
        .join(" ")}.`,
      document: {
        id: id,
        documentBeforeChange: documentBeforeChange,
        documentAfterChange: documentAfterChange,
      },
    };
    await ModificationHistory.create(modificationHistory);

    return { data: JSON.parse(JSON.stringify(response)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const deleteBus = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await Bus.findByIdAndDelete(id);
    if (response) {
      let modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Bus",
        operationType: "Delete",
        date: new Date(),
        message: `Record with ID <span style="font-weight: 610">${response._id}</span> was deleted from <span style="font-weight: 610">Bus</span>.`,
        document: {
          id: id,
          documentBeforeChange: response,
        },
      };
      await ModificationHistory.create(modificationHistory);
      revalidatePath(path);
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const uploadBusFromExcel = async (data: any, userId: string) => {
  try {
    await connectToDatabase();
    const response = await Bus.insertMany(data);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Bus",
        operationType: "Create",
        date: new Date(),
        message: `<span style="font-weight: 610">${data.length}</span> records were added to <span style="font-weight: 610">Bus</span from an excel file.`,
        document: {
          documentAfterChange: `${data.length}`,
        },
      };
      await ModificationHistory.create(modificationHistory);
      return { data: `${data.length} were records uploaded successfully to Bus`, status: 200 };
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
