"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/database";
import TransformersTwoWinding from "../database/models/transformersTwoWinding";
import { IColumn, ICreateUpdateParams, IDefaultParamSchema, ITransformersTwoWinding } from "../../utils/defaultTypes";
import { ObjectId } from "mongodb";
import ModificationHistory from "../database/models/modificationHistory";
import DefaultParam from "../database/models/defaultParams";

export const getAllTransformersTwoWindings = async (
  limit = 10,
  page = 1,
  query = "",
  columns: IColumn[]
): Promise<{
  data: ITransformersTwoWinding[];
  status: number;
  totalPages: number;
  totalDocuments: number;
  completeData: ITransformersTwoWinding[];
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
    const transformersTwoWindings = await TransformersTwoWinding.find(query ? conditions : {})
      .skip(skipAmount)
      .limit(limit);
    const totalDocuments = await TransformersTwoWinding.countDocuments(query ? conditions : {});
    const completeData = await TransformersTwoWinding.find(query ? conditions : {});
    return {
      data: JSON.parse(JSON.stringify(transformersTwoWindings)),
      status: 200,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments: totalDocuments,
      completeData: JSON.parse(JSON.stringify(completeData)),
    };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createTransformersTwoWinding = async (req: ICreateUpdateParams, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const newTransformersTwoWinding = new TransformersTwoWinding({
      ...defaultFields,
      additionalFields,
    });
    await newTransformersTwoWinding.save();

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Transformers Two Winding",
      operationType: "Create",
      date: new Date(),
      message: `New record with ID <span style="font-weight: 610">${newTransformersTwoWinding._id}</span> was added to <span style="font-weight: 610">Transformers Two Winding</span>.`,
      document: {
        id: newTransformersTwoWinding._id,
      },
    };
    await ModificationHistory.create(modificationHistory);

    const createTransformersTwoWindingWithId = await TransformersTwoWinding.findByIdAndUpdate(
      newTransformersTwoWinding._id,
      {
        id: newTransformersTwoWinding._id.toString(),
      }
    );

    return { data: JSON.parse(JSON.stringify(createTransformersTwoWindingWithId)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getTransformersTwoWindingById = async (id: string) => {
  try {
    await connectToDatabase();
    const transformersTwoWindingDetails = await TransformersTwoWinding.findById(id);
    if (!transformersTwoWindingDetails) return { data: "TransformersTwoWinding not found", status: 404 };
    return { data: JSON.parse(JSON.stringify(transformersTwoWindingDetails)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const updateTransformersTwoWinding = async (req: ICreateUpdateParams, id: string, userId: string) => {
  const { defaultFields, additionalFields } = req;
  try {
    await connectToDatabase();
    const response = await TransformersTwoWinding.findByIdAndUpdate(id, {
      ...defaultFields,
      additionalFields,
    });
    const updatedResponse = await TransformersTwoWinding.findById(id);

    const params: IDefaultParamSchema[] = await DefaultParam.find();
    const fields = params[0].transformersTwoWindingColumns;

    const documentBeforeChange = JSON.parse(JSON.stringify(response));
    const documentAfterChange = JSON.parse(JSON.stringify(updatedResponse));

    let modificationHistory: any;
    modificationHistory = {
      userId: new ObjectId(userId),
      databaseName: "Transformers Two Winding",
      operationType: "Update",
      date: new Date(),
      message: `Record with ID <span style="font-weight: 610">${id}</span> was updated. Field${fields
        .map((item) => {
          if (documentBeforeChange.hasOwnProperty(item.field) && documentAfterChange.hasOwnProperty(item.field)) {
            if (documentBeforeChange[item.field] !== documentAfterChange[item.field]) {
              if (item.type === "image") return ` <span style="font-weight: 610">${item.title}</span> was changed,`;
              return ` <span style="font-weight: 610">${
                item.title
              }</span> was changed from <span style="font-weight: 610">${
                documentBeforeChange[item.field]
              }</span> to <span style="font-weight: 610">${documentAfterChange[item.field]},</span>`;
            }
            return null;
          } else if (
            documentBeforeChange?.additionalFields.hasOwnProperty(item.field) &&
            documentAfterChange?.additionalFields.hasOwnProperty(item.field)
          ) {
            if (
              documentBeforeChange.additionalFields[item.field] !== documentAfterChange.additionalFields[item.field]
            ) {
              if (item.type === "image") return ` <span style="font-weight: 610">${item.title}</span> was changed, `;
              return ` <span style="font-weight: 610">${item.title}</span> was changed from{" "}
              <span style="font-weight: 610">${
                documentBeforeChange.additionalFields[item.field]
              }</span> to <span style="font-weight: 610">${documentAfterChange.additionalFields[item.field]},</span>`;
            }
            return null;
          } else {
            return ` <span style="font-weight: 610">${item.title}</span> was updated to <span style="font-weight: 610">
              ${documentBeforeChange?.[item.field] || documentAfterChange.additionalFields?.[item.field]},
            </span>`;
          }
        })
        .filter(Boolean)
        .join(" ")}`,
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

export const deleteTransformersTwoWinding = async (id: string, path: string, userId: string) => {
  try {
    await connectToDatabase();
    const response = await TransformersTwoWinding.findByIdAndDelete(id);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Transformers Two Winding",
        operationType: "Delete",
        date: new Date(),
        message: `Record with ID <span style="font-weight: 610">${response._id}</span> was deleted from <span style="font-weight: 610">Transformers Two Winding"</span>.`,
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

export const uploadTransformersTwoWindingFromExcel = async (data: any, userId: string) => {
  try {
    await connectToDatabase();
    const response = await TransformersTwoWinding.insertMany(data);
    if (response) {
      let modificationHistory: any;
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Transformers Two Winding",
        operationType: "Create",
        date: new Date(),
        message: `<span style="font-weight: 610">${data.length}</span> records were added to Transformers Two Winding" from an excel file.`,
        document: {
          documentAfterChange: `${data.length}`,
        },
      };
      await ModificationHistory.create(modificationHistory);
      return { data: `${data.length} were records uploaded successfully to Transformers Two Winding`, status: 200 };
    }
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
