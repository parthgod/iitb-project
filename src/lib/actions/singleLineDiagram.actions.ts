"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import SingleLineDiagram from "../database/models/singleLineDiagram";
import { IColumn, ICreateUpdateParams, IDefaultParamSchema, ISingleLineDiagram } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";
import DefaultParam from "../database/models/defaultParams";

export const getAllSingleLineDiagrams = async (
  limit = 20,
  page = 1,
  query = "",
  columns: IColumn[]
): Promise<{
  data: ISingleLineDiagram[];
  status: number;
  totalPages: number;
  totalDocuments: number;
  completeData: ISingleLineDiagram[];
}> => {
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
    const singleLineDiagrams = await SingleLineDiagram.find(query ? conditions : {})
      .skip(skipAmount)
      .limit(limit);
    const totalDocuments = await SingleLineDiagram.countDocuments(query ? conditions : {});
    const completeData = await SingleLineDiagram.find(query ? conditions : {});
    return {
      data: JSON.parse(JSON.stringify(singleLineDiagrams)),
      status: 200,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments: totalDocuments,
      completeData: JSON.parse(JSON.stringify(completeData)),
    };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createSingleLineDiagram = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newSingleLineDiagram = new SingleLineDiagram({
      ...defaultFields,
      additionalFields,
    });
    await newSingleLineDiagram.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Single Line Diagram",
      operationType: "Create",
      date: new Date(),
      message: `New record with ID <span style="font-weight: 610">${newSingleLineDiagram._id}</span> was added to <span style="font-weight: 610">Single Line Diagram</span>.`,
      document: {
        id: newSingleLineDiagram._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    return { data: JSON.parse(JSON.stringify(newSingleLineDiagram)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getSingleLineDiagramById = async (id: string) => {
  try {
    await connectToDatabase();
    const singleLineDiagramDetails = await SingleLineDiagram.findById(id);
    if (!singleLineDiagramDetails) return { data: "SingleLineDiagram not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(singleLineDiagramDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateSingleLineDiagram = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await SingleLineDiagram.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    const updatedResponse = await SingleLineDiagram.findById(id);

    const params: IDefaultParamSchema[] = await DefaultParam.find();
    const fields = params[0].singleLineDiagramsColumns;

    const documentBeforeChange = JSON.parse(JSON.stringify(response));
    const documentAfterChange = JSON.parse(JSON.stringify(updatedResponse));

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Single Line Diagram",
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

export const deleteSingleLineDiagram = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await SingleLineDiagram.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Single Line Diagram",
        operationType: "Delete",
        date: new Date(),
        message: `Record with ID <span style="font-weight: 610">${response._id}</span> was deleted from <span style="font-weight: 610">Single Line Diagram</span>.`,
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

export const uploadSingleLineDiagramFromExcel = async (data: any, userId: string) => {
  try {
    await connectToDatabase();
    const response = await SingleLineDiagram.insertMany(data);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Single Line Diagram",
        operationType: "Create",
        date: new Date(),
        message: `<span style="font-weight: 610">${data.length}</span> records were added to <span style="font-weight: 610">Single Line Diagram</span> from an excel file.`,
        document: {
          documentAfterChange: `${data.length}`,
        },
      };
      await ModificationHistory.create(modificationHistory);
      return { data: `${data.length} were records uploaded successfully to Single Line Diagram`, status: 200 };
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const toggleSingleLineDiagramSwitchValue = async (
  id: string,
  column: IColumn,
  userId: string,
  value: "ON" | "OFF"
) => {
  try {
    await connectToDatabase();
    let response;
    if (column.isDefault) {
      response = await SingleLineDiagram.findByIdAndUpdate(id, { [column.field]: value });
    } else {
      const originalSingleLineDiagram = await SingleLineDiagram.findById(id);
      const additionalFields = { ...originalSingleLineDiagram.additionalFields, [column.field]: value };
      response = await SingleLineDiagram.findByIdAndUpdate(id, additionalFields);
    }
    let modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Single Line Diagram",
      operationType: "Update",
      date: new Date(),
      message: `<span style="font-weight: 610">${column.title}'s</span> switch status was set to <span style="font-weight: 610">${value}</span> for record <span style="font-weight: 610">${id}</span> in <span style="font-weight: 610">Single Line Diagram</span> table`,
      document: {
        documentAfterChange: response,
      },
    };
    await ModificationHistory.create(modificationHistory);
    return { data: "Status changed successfully.", status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const deleteManySingleLineDiagram = async (recordsToDelete: string[], userId: string, path: string) => {
  try {
    await connectToDatabase();

    const response = await SingleLineDiagram.deleteMany({ _id: { $in: recordsToDelete } });
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Single Line Diagram",
        operationType: "Delete",
        date: new Date(),
        message: `<span style="font-weight: 610">${recordsToDelete.length}</span> records were deleted from <span style="font-weight: 610">Single Line Diagram</span>.`,
        document: {
          documentAfterChange: `${recordsToDelete.length}`,
        },
      };
      await ModificationHistory.create(modificationHistory);
      revalidatePath(path);
      return {
        data: `${recordsToDelete.length} records were deleted successfully from Single Line Diagram.`,
        status: 200,
      };
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
