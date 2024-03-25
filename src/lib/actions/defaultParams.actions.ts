"use server";

import { ObjectId } from "mongodb";
import { IColumn, IColumnDetails, IDefaultParamSchema } from "../../utils/defaultTypes";
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
  userId: string,
  columnIndex: number
) => {
  await connectToDatabase();
  let newColumns: any;
  const oldParams: IDefaultParamSchema[] = await DefaultParam.find();
  // const columnFieldName = convertField(columnDetails.name);
  if (columnDetails.type === "dropdown") {
    if (columnDetails.dropdownFromExistingTable === "true") {
      newColumns = {
        title: columnDetails.name,
        type: columnDetails.type!,
        tableRef: columnDetails.dropdownTableRef,
        columnRef: columnDetails.dropdownColumnRef,
      };
    } else {
      const dropdownValues = columnDetails.dropdownValues!.map((item: { name: string }) => item.name);
      newColumns = {
        title: columnDetails.name,
        type: columnDetails.type,
        dropdownValues: dropdownValues,
      };
    }
  } else {
    newColumns = {
      title: columnDetails.name,
      type: columnDetails.type!,
    };
  }
  let modificationHistory: any;
  const params = oldParams[0];
  switch (itemColumnName) {
    case "/bus":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Bus",
        operationType: "Update",
        date: new Date(),
        document: {
          documentBeforeChange: params.busColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.busColumns[columnIndex].field;
      newColumns.isDefault = params.busColumns[columnIndex].isDefault;
      newColumns.isRemoved = params.busColumns[columnIndex].isRemoved;
      newColumns.params.busColumns[columnIndex] = newColumns;

      break;

    case "/excitationSystem":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Excitation system",
        operationType: "Update",
        date: new Date(),
        document: {
          documentBeforeChange: params.excitationSystemColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.excitationSystemColumns[columnIndex].field;
      newColumns.isDefault = params.excitationSystemColumns[columnIndex].isDefault;
      newColumns.isRemoved = params.excitationSystemColumns[columnIndex].isRemoved;
      params.excitationSystemColumns[columnIndex] = newColumns;

      break;

    case "/generator":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Generator",
        operationType: "Update",
        date: new Date(),
        document: {
          documentBeforeChange: params.generatorColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.generatorColumns[columnIndex].field;
      newColumns.isDefault = params.generatorColumns[columnIndex].isDefault;
      newColumns.isRemoved = params.generatorColumns[columnIndex].isRemoved;
      params.generatorColumns[columnIndex] = newColumns;

      break;

    case "/load":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Load",
        operationType: "Update",
        date: new Date(),
        document: {
          documentBeforeChange: params.loadsColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.loadsColumns[columnIndex].field;
      newColumns.isDefault = params.loadsColumns[columnIndex].isDefault;
      newColumns.isRemoved = params.loadsColumns[columnIndex].isRemoved;
      params.loadsColumns[columnIndex] = newColumns;

      break;

    case "/seriesCapacitor":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Series Capacitor",
        operationType: "Update",
        date: new Date(),
        document: {
          documentBeforeChange: params.seriesCapacitorColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.seriesCapacitorColumns[columnIndex].field;
      newColumns.isDefault = params.seriesCapacitorColumns[columnIndex].isDefault;
      newColumns.isRemoved = params.seriesCapacitorColumns[columnIndex].isRemoved;
      params.seriesCapacitorColumns[columnIndex] = newColumns;

      break;

    case "/shuntCapacitor":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Shunt Capacitor",
        operationType: "Update",
        date: new Date(),
        document: {
          documentBeforeChange: params.shuntCapacitorColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.shuntCapacitorColumns[columnIndex].field;
      newColumns.isDefault = params.shuntCapacitorColumns[columnIndex].isDefault;
      newColumns.isRemoved = params.shuntCapacitorColumns[columnIndex].isRemoved;
      params.shuntCapacitorColumns[columnIndex] = newColumns;

      break;

    case "/shuntReactor":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Shunt Reactor",
        operationType: "Update",
        date: new Date(),
        document: {
          documentBeforeChange: params.shuntReactorsColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.shuntReactorsColumns[columnIndex].field;
      newColumns.isDefault = params.shuntReactorsColumns[columnIndex].isDefault;
      newColumns.isRemoved = params.shuntReactorsColumns[columnIndex].isRemoved;
      params.shuntReactorsColumns[columnIndex] = newColumns;

      break;

    case "/singleLineDiagram":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Single Line Diagram",
        operationType: "Update",
        date: new Date(),
        document: {
          documentBeforeChange: params.singleLineDiagramsColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.singleLineDiagramsColumns[columnIndex].field;
      newColumns.isDefault = params.singleLineDiagramsColumns[columnIndex].isDefault;
      newColumns.isRemoved = params.singleLineDiagramsColumns[columnIndex].isRemoved;
      params.singleLineDiagramsColumns[columnIndex] = newColumns;

      break;

    case "/transformersThreeWinding":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Transformers Three Winding",
        operationType: "Update",
        date: new Date(),
        document: {
          documentBeforeChange: params.transformersThreeWindingColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.transformersThreeWindingColumns[columnIndex].field;
      newColumns.isDefault = params.transformersThreeWindingColumns[columnIndex].isDefault;
      newColumns.isRemoved = params.transformersThreeWindingColumns[columnIndex].isRemoved;
      params.transformersThreeWindingColumns[columnIndex] = newColumns;

      break;

    case "/transformersTwoWinding":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Transformers Two Winding",
        operationType: "Update",
        date: new Date(),
        document: {
          documentBeforeChange: params.transformersTwoWindingColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.transformersTwoWindingColumns[columnIndex].field;
      newColumns.isDefault = params.transformersTwoWindingColumns[columnIndex].isDefault;
      newColumns.isRemoved = params.transformersTwoWindingColumns[columnIndex].isRemoved;
      params.transformersTwoWindingColumns[columnIndex] = newColumns;

      break;

    case "/transmissionLine":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Transmission Line",
        operationType: "Update",
        date: new Date(),
        document: {
          documentBeforeChange: params.transmissionLinesColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.transmissionLinesColumns[columnIndex].field;
      newColumns.isDefault = params.transmissionLinesColumns[columnIndex].isDefault;
      newColumns.isRemoved = params.transmissionLinesColumns[columnIndex].isRemoved;
      params.transmissionLinesColumns[columnIndex] = newColumns;

      break;

    case "/turbineGovernor":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Turbine Governor",
        operationType: "Update",
        date: new Date(),
        document: {
          documentBeforeChange: params.turbineGovernorColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.turbineGovernorColumns[columnIndex].field;
      newColumns.isDefault = params.turbineGovernorColumns[columnIndex].isDefault;
      newColumns.isRemoved = params.turbineGovernorColumns[columnIndex].isRemoved;
      params.turbineGovernorColumns[columnIndex] = newColumns;

      break;

    case "/ibr":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "IBR",
        operationType: "Update",
        date: new Date(),
        document: {
          documentBeforeChange: params.ibrColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.ibrColumns[columnIndex].field;
      newColumns.isDefault = params.ibrColumns[columnIndex].isDefault;
      newColumns.isRemoved = params.ibrColumns[columnIndex].isRemoved;
      params.ibrColumns[columnIndex] = newColumns;

      break;

    case "/lccHVDCLink":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "LCC-HVDC Link",
        operationType: "Update",
        date: new Date(),
        document: {
          documentBeforeChange: params.lccHVDCLinkColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.lccHVDCLinkColumns[columnIndex].field;
      newColumns.isDefault = params.lccHVDCLinkColumns[columnIndex].isDefault;
      newColumns.isRemoved = params.lccHVDCLinkColumns[columnIndex].isRemoved;
      params.lccHVDCLinkColumns[columnIndex] = newColumns;

      break;

    case "/seriesFact":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Series Fact",
        operationType: "Update",
        date: new Date(),
        document: {
          documentBeforeChange: params.seriesFactsColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.seriesFactsColumns[columnIndex].field;
      newColumns.isDefault = params.seriesFactsColumns[columnIndex].isDefault;
      newColumns.isRemoved = params.seriesFactsColumns[columnIndex].isRemoved;
      params.seriesFactsColumns[columnIndex] = newColumns;

      break;

    case "/shuntFact":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Shunt Fact",
        operationType: "Update",
        date: new Date(),
        document: {
          documentBeforeChange: params.shuntFactsColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.shuntFactsColumns[columnIndex].field;
      newColumns.isDefault = params.shuntFactsColumns[columnIndex].isDefault;
      newColumns.isRemoved = params.shuntFactsColumns[columnIndex].isRemoved;
      params.shuntFactsColumns[columnIndex] = newColumns;

      break;

    case "/vscHVDCLink":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "VSC-HVDC Link",
        operationType: "Update",
        date: new Date(),
        document: {
          documentBeforeChange: params.vscHVDCLinkColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.vscHVDCLinkColumns[columnIndex].field;
      newColumns.isDefault = params.vscHVDCLinkColumns[columnIndex].isDefault;
      newColumns.isRemoved = params.vscHVDCLinkColumns[columnIndex].isRemoved;
      params.vscHVDCLinkColumns[columnIndex] = newColumns;

      break;

    default:
      break;
  }
  const newDefaultParams = await DefaultParam.findByIdAndUpdate(params._id, {
    busColumns: params.busColumns,
    excitationSystemColumns: params.excitationSystemColumns,
    generatorColumns: params.generatorColumns,
    loadsColumns: params.loadsColumns,
    seriesCapacitorColumns: params.seriesCapacitorColumns,
    shuntCapacitorColumns: params.shuntCapacitorColumns,
    shuntReactorsColumns: params.shuntReactorsColumns,
    singleLineDiagramsColumns: params.singleLineDiagramsColumns,
    transformersThreeWindingColumns: params.transformersThreeWindingColumns,
    transformersTwoWindingColumns: params.transformersTwoWindingColumns,
    transmissionLinesColumns: params.transmissionLinesColumns,
    turbineGovernorColumns: params.turbineGovernorColumns,
    ibrColumns: params.ibrColumns,
    lccHVDCLinkColumns: params.lccHVDCLinkColumns,
    seriesFactsColumns: params.seriesFactsColumns,
    shuntFactsColumns: params.shuntFactsColumns,
    vscHVDCLinkColumns: params.vscHVDCLinkColumns,
  });
  await ModificationHistory.create(modificationHistory);
  return { data: JSON.parse(JSON.stringify(newDefaultParams)), status: 200 };
};

export const updateDefaultParams = async (
  columnDetails: IColumnDetails,
  itemColumnName: string,
  userId: string,
  columnIndex: number
) => {
  try {
    await connectToDatabase();
    let newColumns: IColumn;
    const oldParams: IDefaultParamSchema[] = await DefaultParam.find();
    const columnFieldName = convertField(columnDetails.name);
    let alreadyExists;
    switch (itemColumnName) {
      case "/bus":
        alreadyExists = oldParams[0].busColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists)
          return { data: `${columnDetails.name} already exists. Try using a different name`, status: 409 };
        break;

      case "/excitationSystem":
        alreadyExists = oldParams[0].excitationSystemColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists)
          return { data: `${columnDetails.name} already exists. Try using a different name`, status: 409 };
        break;

      case "/generator":
        alreadyExists = oldParams[0].generatorColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists)
          return { data: `${columnDetails.name} already exists. Try using a different name`, status: 409 };
        break;

      case "/load":
        alreadyExists = oldParams[0].loadsColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists)
          return { data: `${columnDetails.name} already exists. Try using a different name`, status: 409 };
        break;

      case "/seriesCapacitor":
        alreadyExists = oldParams[0].seriesCapacitorColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists)
          return { data: `${columnDetails.name} already exists. Try using a different name`, status: 409 };
        break;

      case "/shuntCapacitor":
        alreadyExists = oldParams[0].shuntCapacitorColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists)
          return { data: `${columnDetails.name} already exists. Try using a different name`, status: 409 };
        break;

      case "/shuntReactor":
        alreadyExists = oldParams[0].shuntReactorsColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists)
          return { data: `${columnDetails.name} already exists. Try using a different name`, status: 409 };
        break;

      case "/singleLineDiagram":
        alreadyExists = oldParams[0].singleLineDiagramsColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists)
          return { data: `${columnDetails.name} already exists. Try using a different name`, status: 409 };
        break;

      case "/transformersThreeWinding":
        alreadyExists = oldParams[0].transformersThreeWindingColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists)
          return { data: `${columnDetails.name} already exists. Try using a different name`, status: 409 };
        break;

      case "/transformersTwoWinding":
        alreadyExists = oldParams[0].transformersTwoWindingColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists)
          return { data: `${columnDetails.name} already exists. Try using a different name`, status: 409 };
        break;

      case "/transmissionLine":
        alreadyExists = oldParams[0].transmissionLinesColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists)
          return { data: `${columnDetails.name} already exists. Try using a different name`, status: 409 };
        break;

      case "/turbineGovernor":
        alreadyExists = oldParams[0].turbineGovernorColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists)
          return { data: `${columnDetails.name} already exists. Try using a different name`, status: 409 };
        break;

      case "/ibr":
        alreadyExists = oldParams[0].ibrColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists)
          return { data: `${columnDetails.name} already exists. Try using a different name`, status: 409 };
        break;

      case "/lccHVDCLink":
        alreadyExists = oldParams[0].lccHVDCLinkColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists)
          return { data: `${columnDetails.name} already exists. Try using a different name`, status: 409 };
        break;

      case "/seriesFact":
        alreadyExists = oldParams[0].seriesFactsColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists)
          return { data: `${columnDetails.name} already exists. Try using a different name`, status: 409 };
        break;

      case "/shuntFact":
        alreadyExists = oldParams[0].shuntFactsColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists)
          return { data: `${columnDetails.name} already exists. Try using a different name`, status: 409 };
        break;

      case "/vscHVDCLink":
        alreadyExists = oldParams[0].vscHVDCLinkColumns.find((item) => item.field === columnFieldName);
        if (alreadyExists)
          return { data: `${columnDetails.name} already exists. Try using a different name`, status: 409 };
        break;

      default:
        break;
    }

    if (columnDetails.type === "dropdown") {
      if (columnDetails.dropdownFromExistingTable === "true") {
        newColumns = {
          field: columnFieldName,
          title: columnDetails.name,
          type: columnDetails.type!,
          tableRef: columnDetails.dropdownTableRef,
          columnRef: columnDetails.dropdownColumnRef,
          isDefault: false,
          isRemoved: false,
        };
      } else {
        const dropdownValues = columnDetails.dropdownValues!.map((item: { name: string }) => item.name);
        newColumns = {
          field: columnFieldName,
          title: columnDetails.name,
          type: columnDetails.type,
          dropdownValues: dropdownValues,
          isDefault: false,
          isRemoved: false,
        };
      }
    } else {
      newColumns = {
        field: columnFieldName,
        title: columnDetails.name,
        type: columnDetails.type!,
        isDefault: false,
        isRemoved: false,
      };
    }

    const newParams = oldParams[0];
    let modificationHistory: any;

    switch (itemColumnName) {
      case "/bus":
        newParams.busColumns.splice(columnIndex, 0, newColumns);
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
        newParams.excitationSystemColumns.splice(columnIndex, 0, newColumns);
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
        newParams.generatorColumns.splice(columnIndex, 0, newColumns);
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
        newParams.loadsColumns.splice(columnIndex, 0, newColumns);
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
        newParams.seriesCapacitorColumns.splice(columnIndex, 0, newColumns);
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
        newParams.shuntCapacitorColumns.splice(columnIndex, 0, newColumns);
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
        newParams.shuntReactorsColumns.splice(columnIndex, 0, newColumns);
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
        newParams.singleLineDiagramsColumns.splice(columnIndex, 0, newColumns);
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
        newParams.transformersThreeWindingColumns.splice(columnIndex, 0, newColumns);
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
        newParams.transformersTwoWindingColumns.splice(columnIndex, 0, newColumns);
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
        newParams.transmissionLinesColumns.splice(columnIndex, 0, newColumns);
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
        newParams.turbineGovernorColumns.splice(columnIndex, 0, newColumns);
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

      case "/ibr":
        newParams.ibrColumns.splice(columnIndex, 0, newColumns);
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "IBR",
          operationType: "Create",
          date: new Date(),
          document: {
            columnDetails: newColumns,
          },
        };
        break;

      case "/lccHVDCLink":
        newParams.lccHVDCLinkColumns.splice(columnIndex, 0, newColumns);
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "LCC-HVDC Link",
          operationType: "Create",
          date: new Date(),
          document: {
            columnDetails: newColumns,
          },
        };
        break;

      case "/seriesFact":
        newParams.seriesFactsColumns.splice(columnIndex, 0, newColumns);
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Series Fact",
          operationType: "Create",
          date: new Date(),
          document: {
            columnDetails: newColumns,
          },
        };
        break;

      case "/shuntFact":
        newParams.shuntFactsColumns.splice(columnIndex, 0, newColumns);
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Shunt Fact",
          operationType: "Create",
          date: new Date(),
          document: {
            columnDetails: newColumns,
          },
        };
        break;

      case "/vscHVDCLink":
        newParams.vscHVDCLinkColumns.splice(columnIndex, 0, newColumns);
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "VSC-HVDC Link",
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
      ibrColumns: newParams.ibrColumns,
      lccHVDCLinkColumns: newParams.lccHVDCLinkColumns,
      seriesFactsColumns: newParams.seriesFactsColumns,
      shuntFactsColumns: newParams.shuntFactsColumns,
      vscHVDCLinkColumns: newParams.vscHVDCLinkColumns,
    });

    await ModificationHistory.create(modificationHistory);

    return { data: JSON.parse(JSON.stringify(newDefaultParams)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const toggleDefaultParam = async (
  itemColumnName: string,
  userId: string,
  columnIndex: number,
  operationType: "Remove-One" | "Remove-Many" | "Update-Many",
  newColumns?: IColumn[]
) => {
  try {
    await connectToDatabase();
    const data: IDefaultParamSchema[] = await DefaultParam.find();
    const params = data[0];
    let modificationHistory: any;
    switch (itemColumnName) {
      case "/bus":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Bus",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          document: {
            documentBeforeChange: operationType === "Remove-One" ? params.busColumns[columnIndex] : params.busColumns,
            documentAfterChange: operationType === "Remove-One" ? null : newColumns,
          },
        };
        if (operationType === "Remove-One") params.busColumns[columnIndex].isRemoved = true;
        else params.busColumns = newColumns!;

        break;

      case "/excitationSystem":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Excitation system",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          document: {
            documentBeforeChange:
              operationType === "Remove-One"
                ? params.excitationSystemColumns[columnIndex]
                : params.excitationSystemColumns,
            documentAfterChange: operationType === "Remove-One" ? null : newColumns,
          },
        };
        if (operationType === "Remove-One") params.excitationSystemColumns[columnIndex].isRemoved = true;
        else params.excitationSystemColumns = newColumns!;
        break;

      case "/generator":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Generator",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          document: {
            documentBeforeChange:
              operationType === "Remove-One" ? params.generatorColumns[columnIndex] : params.generatorColumns,
            documentAfterChange: operationType === "Remove-One" ? null : newColumns,
          },
        };
        if (operationType === "Remove-One") params.generatorColumns[columnIndex].isRemoved = true;
        else params.generatorColumns = newColumns!;
        break;

      case "/load":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Load",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          document: {
            documentBeforeChange:
              operationType === "Remove-One" ? params.loadsColumns[columnIndex] : params.loadsColumns,
            documentAfterChange: operationType === "Remove-One" ? null : newColumns,
          },
        };
        if (operationType === "Remove-One") params.loadsColumns[columnIndex].isRemoved = true;
        else params.loadsColumns = newColumns!;
        break;

      case "/seriesCapacitor":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Series Capacitor",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          document: {
            documentBeforeChange:
              operationType === "Remove-One"
                ? params.seriesCapacitorColumns[columnIndex]
                : params.seriesCapacitorColumns,
            documentAfterChange: operationType === "Remove-One" ? null : newColumns,
          },
        };
        if (operationType === "Remove-One") params.seriesCapacitorColumns[columnIndex].isRemoved = true;
        else params.seriesCapacitorColumns = newColumns!;
        break;

      case "/shuntCapacitor":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Shunt Capacitor",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          document: {
            documentBeforeChange:
              operationType === "Remove-One" ? params.shuntCapacitorColumns[columnIndex] : params.shuntCapacitorColumns,
            documentAfterChange: operationType === "Remove-One" ? null : newColumns,
          },
        };
        if (operationType === "Remove-One") params.shuntCapacitorColumns[columnIndex].isRemoved = true;
        else params.shuntCapacitorColumns = newColumns!;
        break;

      case "/shuntReactor":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Shunt Reactor",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          document: {
            documentBeforeChange:
              operationType === "Remove-One" ? params.shuntReactorsColumns[columnIndex] : params.shuntReactorsColumns,
            documentAfterChange: operationType === "Remove-One" ? null : newColumns,
          },
        };
        if (operationType === "Remove-One") params.shuntReactorsColumns[columnIndex].isRemoved = true;
        else params.shuntReactorsColumns = newColumns!;
        break;

      case "/singleLineDiagram":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Single Line Diagram",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          document: {
            documentBeforeChange:
              operationType === "Remove-One"
                ? params.singleLineDiagramsColumns[columnIndex]
                : params.singleLineDiagramsColumns,
            documentAfterChange: operationType === "Remove-One" ? null : newColumns,
          },
        };
        if (operationType === "Remove-One") params.singleLineDiagramsColumns[columnIndex].isRemoved = true;
        else params.singleLineDiagramsColumns = newColumns!;
        break;

      case "/transformersThreeWinding":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Transformers Three Winding",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          document: {
            documentBeforeChange:
              operationType === "Remove-One"
                ? params.transformersThreeWindingColumns[columnIndex]
                : params.transformersThreeWindingColumns,
            documentAfterChange: operationType === "Remove-One" ? null : newColumns,
          },
        };
        if (operationType === "Remove-One") params.transformersThreeWindingColumns[columnIndex].isRemoved = true;
        else params.transformersThreeWindingColumns = newColumns!;
        break;

      case "/transformersTwoWinding":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Transformers Two Winding",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          document: {
            documentBeforeChange:
              operationType === "Remove-One"
                ? params.transformersTwoWindingColumns[columnIndex]
                : params.transformersTwoWindingColumns,
            documentAfterChange: operationType === "Remove-One" ? null : newColumns,
          },
        };
        if (operationType === "Remove-One") params.transformersTwoWindingColumns[columnIndex].isRemoved = true;
        else params.transformersTwoWindingColumns = newColumns!;
        break;

      case "/transmissionLine":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Transmission Line",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          document: {
            documentBeforeChange:
              operationType === "Remove-One"
                ? params.transmissionLinesColumns[columnIndex]
                : params.transmissionLinesColumns,
            documentAfterChange: operationType === "Remove-One" ? null : newColumns,
          },
        };
        if (operationType === "Remove-One") params.transmissionLinesColumns[columnIndex].isRemoved = true;
        else params.transmissionLinesColumns = newColumns!;
        break;

      case "/turbineGovernor":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Turbine Governor",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          document: {
            documentBeforeChange:
              operationType === "Remove-One"
                ? params.turbineGovernorColumns[columnIndex]
                : params.turbineGovernorColumns,
            documentAfterChange: operationType === "Remove-One" ? null : newColumns,
          },
        };
        if (operationType === "Remove-One") params.turbineGovernorColumns[columnIndex].isRemoved = true;
        else params.turbineGovernorColumns = newColumns!;
        break;

      case "/ibr":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "IBR",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          document: {
            documentBeforeChange: operationType === "Remove-One" ? params.ibrColumns[columnIndex] : params.ibrColumns,
            documentAfterChange: operationType === "Remove-One" ? null : newColumns,
          },
        };
        if (operationType === "Remove-One") params.ibrColumns[columnIndex].isRemoved = true;
        else params.ibrColumns = newColumns!;
        break;

      case "/lccHVDCLink":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "LCC-HVDC Link",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          document: {
            documentBeforeChange:
              operationType === "Remove-One" ? params.lccHVDCLinkColumns[columnIndex] : params.lccHVDCLinkColumns,
            documentAfterChange: operationType === "Remove-One" ? null : newColumns,
          },
        };
        if (operationType === "Remove-One") params.lccHVDCLinkColumns[columnIndex].isRemoved = true;
        else params.lccHVDCLinkColumns = newColumns!;
        break;

      case "/seriesFact":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Series Fact",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          document: {
            documentBeforeChange:
              operationType === "Remove-One" ? params.seriesFactsColumns[columnIndex] : params.seriesFactsColumns,
            documentAfterChange: operationType === "Remove-One" ? null : newColumns,
          },
        };
        if (operationType === "Remove-One") params.seriesFactsColumns[columnIndex].isRemoved = true;
        else params.seriesFactsColumns = newColumns!;
        break;

      case "/shuntFact":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Shunt Fact",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          document: {
            documentBeforeChange:
              operationType === "Remove-One" ? params.shuntFactsColumns[columnIndex] : params.shuntFactsColumns,
            documentAfterChange: operationType === "Remove-One" ? null : newColumns,
          },
        };
        if (operationType === "Remove-One") params.shuntFactsColumns[columnIndex].isRemoved = true;
        else params.shuntFactsColumns = newColumns!;
        break;

      case "/vscHVDCLink":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "VSC-HVDC Link",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          document: {
            documentBeforeChange:
              operationType === "Remove-One" ? params.vscHVDCLinkColumns[columnIndex] : params.vscHVDCLinkColumns,
            documentAfterChange: operationType === "Remove-One" ? null : newColumns,
          },
        };
        if (operationType === "Remove-One") params.vscHVDCLinkColumns[columnIndex].isRemoved = true;
        else params.vscHVDCLinkColumns = newColumns!;
        break;

      default:
        break;
    }

    const newDefaultParams = await DefaultParam.findByIdAndUpdate(params._id, {
      busColumns: params.busColumns,
      excitationSystemColumns: params.excitationSystemColumns,
      generatorColumns: params.generatorColumns,
      loadsColumns: params.loadsColumns,
      seriesCapacitorColumns: params.seriesCapacitorColumns,
      shuntCapacitorColumns: params.shuntCapacitorColumns,
      shuntReactorsColumns: params.shuntReactorsColumns,
      singleLineDiagramsColumns: params.singleLineDiagramsColumns,
      transformersThreeWindingColumns: params.transformersThreeWindingColumns,
      transformersTwoWindingColumns: params.transformersTwoWindingColumns,
      transmissionLinesColumns: params.transmissionLinesColumns,
      turbineGovernorColumns: params.turbineGovernorColumns,
      ibrColumns: params.ibrColumns,
      lccHVDCLinkColumns: params.lccHVDCLinkColumns,
      seriesFactsColumns: params.seriesFactsColumns,
      shuntFactsColumns: params.shuntFactsColumns,
      vscHVDCLinkColumns: params.vscHVDCLinkColumns,
    });
    await ModificationHistory.create(modificationHistory);
    return { data: JSON.parse(JSON.stringify(newDefaultParams)), status: 200 };
  } catch (error) {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};
