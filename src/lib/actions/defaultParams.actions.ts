"use server";

import { ObjectId } from "mongodb";
import { IColumn, IColumnDetails, IDefaultParamSchema, ISubColumn } from "../../utils/defaultTypes";
import { convertField } from "../../utils/helperFunctions";
import { connectToDatabase } from "../database/database";
import DefaultParam from "../database/models/defaultParams";
import ModificationHistory from "../database/models/modificationHistory";

export const getDefaultParams = async (): Promise<{ data: IDefaultParamSchema[]; status: number }> => {
  try {
    await connectToDatabase();
    const defaultParams = await DefaultParam.find();
    return { data: JSON.parse(JSON.stringify(defaultParams)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const createDefaultParams = async () => {
  try {
    await connectToDatabase();
    const newDefaultParams = new DefaultParam();
    await newDefaultParams.save();
    return { data: JSON.parse(JSON.stringify(newDefaultParams)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const editSpecificDefaultParam = async (
  columnDetails: IColumnDetails,
  itemColumnName: string,
  isDefault: boolean,
  userId: string
) => {
  await connectToDatabase();
  let newColumns: IColumn;
  const oldParams: IDefaultParamSchema[] = await DefaultParam.find();
  const columnFieldName = convertField(columnDetails.name);
  if (columnDetails.hasSubcolumns === "true") {
    columnDetails.type = "subColumns";
    columnDetails.subcolumns!.forEach((subItem: ISubColumn) => {
      subItem.field = convertField(columnDetails.name + subItem.title);
      if (subItem.type === "dropdown") {
        subItem.dropdownValues = subItem.dropdownValues!.map((dropdownValue: any) => dropdownValue.name);
      } else {
        delete subItem.dropdownValues;
      }
    });
    newColumns = {
      field: columnFieldName,
      title: columnDetails.name,
      type: columnDetails.type,
      subColumns: columnDetails.subcolumns,
      isDefault: isDefault,
    };
  } else {
    if (columnDetails.type === "dropdown") {
      const dropdownValues = columnDetails.dropdownValues!.map((item) => item.name);
      newColumns = {
        field: columnFieldName,
        title: columnDetails.name,
        type: columnDetails.type,
        dropdownValues: dropdownValues,
        isDefault: isDefault,
      };
    } else {
      newColumns = {
        field: columnFieldName,
        title: columnDetails.name,
        type: columnDetails.type!,
        isDefault: isDefault,
      };
    }
  }
  const newParams = oldParams[0];
  let modificationHistory: any;
  switch (itemColumnName) {
    case "/bus":
      newParams.busColumns = oldParams[0].busColumns.map((column) => {
        if (column.field === newColumns.field) return newColumns;
        else return column;
      });
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Bus",
        operationType: "Update",
        date: new Date(),
        document: {
          columnDetails: newColumns,
        },
      };
      break;

    case "/excitationSystem":
      newParams.excitationSystemColumns = oldParams[0].excitationSystemColumns.map((column) => {
        if (column.field === newColumns.field) return newColumns;
        else return column;
      });
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Excitation system",
        operationType: "Update",
        date: new Date(),
        document: {
          columnDetails: newColumns,
        },
      };
      break;

    case "/generator":
      newParams.generatorColumns = oldParams[0].generatorColumns.map((column) => {
        if (column.field === newColumns.field) return newColumns;
        else return column;
      });
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Bus",
        operationType: "Generator",
        date: new Date(),
        document: {
          columnDetails: newColumns,
        },
      };
      break;

    case "/load":
      newParams.loadsColumns = oldParams[0].loadsColumns.map((column) => {
        if (column.field === newColumns.field) return newColumns;
        else return column;
      });
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Load",
        operationType: "Update",
        date: new Date(),
        document: {
          columnDetails: newColumns,
        },
      };
      break;

    case "/seriesCapacitor":
      newParams.seriesCapacitorColumns = oldParams[0].seriesCapacitorColumns.map((column) => {
        if (column.field === newColumns.field) return newColumns;
        else return column;
      });
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Series Capacitor",
        operationType: "Update",
        date: new Date(),
        document: {
          columnDetails: newColumns,
        },
      };
      break;

    case "/shuntCapacitor":
      newParams.shuntCapacitorColumns = oldParams[0].shuntCapacitorColumns.map((column) => {
        if (column.field === newColumns.field) return newColumns;
        else return column;
      });
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Shunt Capacitor",
        operationType: "Update",
        date: new Date(),
        document: {
          columnDetails: newColumns,
        },
      };
      break;

    case "/shuntReactor":
      newParams.shuntReactorsColumns = oldParams[0].shuntReactorsColumns.map((column) => {
        if (column.field === newColumns.field) return newColumns;
        else return column;
      });
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Shunt Reactor",
        operationType: "Update",
        date: new Date(),
        document: {
          columnDetails: newColumns,
        },
      };
      break;

    case "/singleLineDiagram":
      newParams.singleLineDiagramsColumns = oldParams[0].singleLineDiagramsColumns.map((column) => {
        if (column.field === newColumns.field) return newColumns;
        else return column;
      });
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Single Line Diagram",
        operationType: "Update",
        date: new Date(),
        document: {
          columnDetails: newColumns,
        },
      };
      break;

    case "/transformersThreeWinding":
      newParams.transformersThreeWindingColumns = oldParams[0].transformersThreeWindingColumns.map((column) => {
        if (column.field === newColumns.field) return newColumns;
        else return column;
      });
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Transformers Three Winding",
        operationType: "Update",
        date: new Date(),
        document: {
          columnDetails: newColumns,
        },
      };
      break;

    case "/transformersTwoWinding":
      newParams.transformersTwoWindingColumns = oldParams[0].transformersTwoWindingColumns.map((column) => {
        if (column.field === newColumns.field) return newColumns;
        else return column;
      });
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Transformers Two Winding",
        operationType: "Update",
        date: new Date(),
        document: {
          columnDetails: newColumns,
        },
      };
      break;

    case "/transmissionLine":
      newParams.transmissionLinesColumns = oldParams[0].transmissionLinesColumns.map((column) => {
        if (column.field === newColumns.field) return newColumns;
        else return column;
      });
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Transmission Line",
        operationType: "Update",
        date: new Date(),
        document: {
          columnDetails: newColumns,
        },
      };
      break;

    case "/turbineGovernor":
      newParams.turbineGovernorColumns = oldParams[0].turbineGovernorColumns.map((column) => {
        if (column.field === newColumns.field) return newColumns;
        else return column;
      });
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Turbine Governor",
        operationType: "Update",
        date: new Date(),
        document: {
          columnDetails: newColumns,
        },
      };
      break;

    default:
      break;
  }
  console.log(newColumns);
  const newDefaultParams = await DefaultParam.findByIdAndUpdate(newParams._id, {
    busColumns: newParams.busColumns,
    excitationSystemColumns: newParams.excitationSystemColumns,
    generatorColumns: newParams.generatorColumns,
    loadsColumns: newParams.loadsColumns,
    seriesCapacitorColumns: newParams.seriesCapacitorColumns,
    shuntCapacitorColumns: newParams.shuntCapacitorColumns,
    shuntReactorsColumns: newParams.shuntReactorsColumns,
    singleLineDiagramsColumns: newParams.singleLineDiagramsColumns,
    transformersThreeWindingColumns: newParams.transformersThreeWindingColumns,
    transformersTwoWindingColumns: newParams.transformersTwoWindingColumns,
    transmissionLinesColumns: newParams.transmissionLinesColumns,
    turbineGovernorColumns: newParams.turbineGovernorColumns,
  });
  await ModificationHistory.create(modificationHistory);
  return { data: JSON.parse(JSON.stringify(newDefaultParams)), status: 200 };
};

export const updateDefaultParams = async (columnDetails: IColumnDetails, itemColumnName: string, userId: string) => {
  try {
    await connectToDatabase();
    let newColumns: IColumn;
    const oldParams: IDefaultParamSchema[] = await DefaultParam.find();
    const columnFieldName = convertField(columnDetails.name);
    let alreadyExists;
    switch (itemColumnName) {
      case "/bus":
        alreadyExists = oldParams[0].busColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists) return { data: `${columnDetails.name} already exists`, status: 409 };
        break;

      case "/excitationSystem":
        alreadyExists = oldParams[0].excitationSystemColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists) return { data: `${columnDetails.name} already exists`, status: 409 };
        break;

      case "/generator":
        alreadyExists = oldParams[0].generatorColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists) return { data: `${columnDetails.name} already exists`, status: 409 };
        break;

      case "/load":
        alreadyExists = oldParams[0].loadsColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists) return { data: `${columnDetails.name} already exists`, status: 409 };
        break;

      case "/seriesCapacitor":
        alreadyExists = oldParams[0].seriesCapacitorColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists) return { data: `${columnDetails.name} already exists`, status: 409 };
        break;

      case "/shuntCapacitor":
        alreadyExists = oldParams[0].shuntCapacitorColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists) return { data: `${columnDetails.name} already exists`, status: 409 };
        break;

      case "/shuntReactor":
        alreadyExists = oldParams[0].shuntReactorsColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists) return { data: `${columnDetails.name} already exists`, status: 409 };
        break;

      case "/singleLineDiagram":
        alreadyExists = oldParams[0].singleLineDiagramsColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists) return { data: `${columnDetails.name} already exists`, status: 409 };
        break;

      case "/transformersThreeWinding":
        alreadyExists = oldParams[0].transformersThreeWindingColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists) return { data: `${columnDetails.name} already exists`, status: 409 };
        break;

      case "/transformersTwoWinding":
        alreadyExists = oldParams[0].transformersTwoWindingColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists) return { data: `${columnDetails.name} already exists`, status: 409 };
        break;

      case "/transmissionLine":
        alreadyExists = oldParams[0].transmissionLinesColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists) return { data: `${columnDetails.name} already exists`, status: 409 };
        break;

      case "/turbineGovernor":
        alreadyExists = oldParams[0].turbineGovernorColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists) return { data: `${columnDetails.name} already exists`, status: 409 };
        break;

      default:
        break;
    }
    if (columnDetails.hasSubcolumns === "true") {
      columnDetails.type = "subColumns";
      columnDetails.subcolumns!.forEach((subItem: ISubColumn) => {
        subItem.field = convertField(columnDetails.name + subItem.title);
        if (subItem.type === "dropdown") {
          subItem.dropdownValues = subItem.dropdownValues!.map((dropdownValue: { name: string }) => dropdownValue.name);
        }
      });
      newColumns = {
        field: columnFieldName,
        title: columnDetails.name,
        type: columnDetails.type,
        subColumns: columnDetails.subcolumns,
        isDefault: false,
      };
    } else {
      if (columnDetails.type === "dropdown") {
        const dropdownValues = columnDetails.dropdownValues!.map((item: { name: string }) => item.name);
        newColumns = {
          field: columnFieldName,
          title: columnDetails.name,
          type: columnDetails.type,
          dropdownValues: dropdownValues,
          isDefault: false,
        };
      } else {
        newColumns = {
          field: columnFieldName,
          title: columnDetails.name,
          type: columnDetails.type!,
          isDefault: false,
        };
      }
    }
    const newParams = oldParams[0];
    let modificationHistory: any;
    switch (itemColumnName) {
      case "/bus":
        newParams.busColumns.push(newColumns);
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Bus",
          operationType: "Create",
          date: new Date(),
          document: {
            columnDetails: newColumns,
          },
        };
        break;

      case "/excitationSystem":
        newParams.excitationSystemColumns.push(newColumns);
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Excitation System",
          operationType: "Create",
          date: new Date(),
          document: {
            columnDetails: newColumns,
          },
        };
        break;

      case "/generator":
        newParams.generatorColumns.push(newColumns);
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Generator",
          operationType: "Create",
          date: new Date(),
          document: {
            columnDetails: newColumns,
          },
        };
        break;

      case "/load":
        newParams.loadsColumns.push(newColumns);
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Load",
          operationType: "Create",
          date: new Date(),
          document: {
            columnDetails: newColumns,
          },
        };
        break;

      case "/seriesCapacitor":
        newParams.seriesCapacitorColumns.push(newColumns);
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Series Capacitor",
          operationType: "Create",
          date: new Date(),
          document: {
            columnDetails: newColumns,
          },
        };
        break;

      case "/shuntCapacitor":
        newParams.shuntCapacitorColumns.push(newColumns);
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Shunt Capacitor",
          operationType: "Create",
          date: new Date(),
          document: {
            columnDetails: newColumns,
          },
        };
        break;

      case "/shuntReactor":
        newParams.shuntReactorsColumns.push(newColumns);
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Shunt Reactor",
          operationType: "Create",
          date: new Date(),
          document: {
            columnDetails: newColumns,
          },
        };
        break;

      case "/singleLineDiagram":
        newParams.singleLineDiagramsColumns.push(newColumns);
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Single Line Diagram",
          operationType: "Create",
          date: new Date(),
          document: {
            columnDetails: newColumns,
          },
        };
        break;

      case "/transformersThreeWinding":
        newParams.transformersThreeWindingColumns.push(newColumns);
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Transformers Three Winding",
          operationType: "Create",
          date: new Date(),
          document: {
            columnDetails: newColumns,
          },
        };
        break;

      case "/transformersTwoWinding":
        newParams.transformersTwoWindingColumns.push(newColumns);
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Transformers Two Winding",
          operationType: "Create",
          date: new Date(),
          document: {
            columnDetails: newColumns,
          },
        };
        break;

      case "/transmissionLine":
        newParams.transmissionLinesColumns.push(newColumns);
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Transmission Line",
          operationType: "Create",
          date: new Date(),
          document: {
            columnDetails: newColumns,
          },
        };
        break;

      case "/turbineGovernor":
        newParams.turbineGovernorColumns.push(newColumns);
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Turbine Governor",
          operationType: "Create",
          date: new Date(),
          document: {
            columnDetails: newColumns,
          },
        };
        break;

      default:
        break;
    }

    const newDefaultParams = await DefaultParam.findByIdAndUpdate(newParams._id, {
      busColumns: newParams.busColumns,
      excitationSystemColumns: newParams.excitationSystemColumns,
      generatorColumns: newParams.generatorColumns,
      loadsColumns: newParams.loadsColumns,
      seriesCapacitorColumns: newParams.seriesCapacitorColumns,
      shuntCapacitorColumns: newParams.shuntCapacitorColumns,
      shuntReactorsColumns: newParams.shuntReactorsColumns,
      singleLineDiagramsColumns: newParams.singleLineDiagramsColumns,
      transformersThreeWindingColumns: newParams.transformersThreeWindingColumns,
      transformersTwoWindingColumns: newParams.transformersTwoWindingColumns,
      transmissionLinesColumns: newParams.transmissionLinesColumns,
      turbineGovernorColumns: newParams.turbineGovernorColumns,
    });

    await ModificationHistory.create(modificationHistory);

    return { data: JSON.parse(JSON.stringify(newDefaultParams)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
