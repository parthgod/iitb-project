"use server";

import { ObjectId } from "mongodb";
import { IColumn, IColumnDetails, IDefaultParamSchema } from "../../utils/defaultTypes";
import { convertField, reverseUnslug } from "../../utils/helperFunctions";
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
        message: `Column <span style="font-weight: 610">${
          params.busColumns[columnIndex].title
        }</span> was updated for <span style="font-weight: 610">Bus</span> table. ${
          params.busColumns[columnIndex].title !== newColumns.title
            ? `It's new name is <span style="font-weight: 610">${newColumns.title}</span> and is`
            : `It is now`
        } of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
          newColumns.type === "dropdown"
            ? newColumns.tableRef
              ? `linked to <span style="font-weight: 610"> ${
                  newColumns.tableRef === "Bus"
                    ? params.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                    : params.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                } </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table.`
              : `having dropdown values:<span style="font-weight: 610">${
                  newColumns.dropdownValues &&
                  newColumns.dropdownValues.map((dropdownValue: string) => ` ${dropdownValue}`)
                }
              </span>
            `
            : ""
        }.`,
        document: {
          documentBeforeChange: params.busColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.busColumns[columnIndex].field;
      newColumns.isDefault = params.busColumns[columnIndex].isDefault;
      newColumns.isHidden = params.busColumns[columnIndex].isHidden;
      params.busColumns[columnIndex] = newColumns;

      break;

    case "/excitationSystem":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Excitation system",
        operationType: "Update",
        date: new Date(),
        message: `Column <span style="font-weight: 610">${
          params.excitationSystemColumns[columnIndex].title
        }</span> was updated for <span style="font-weight: 610">Excitation system</span> table. ${
          params.excitationSystemColumns[columnIndex].title !== newColumns.title
            ? `It's new name is <span style="font-weight: 610">${newColumns.title}</span> and is`
            : `It is now`
        } of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
          newColumns.type === "dropdown"
            ? newColumns.tableRef
              ? `linked to <span style="font-weight: 610"> ${
                  newColumns.tableRef === "Bus"
                    ? params.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                    : params.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                } </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table.`
              : `having dropdown values:<span style="font-weight: 610">${
                  newColumns.dropdownValues &&
                  newColumns.dropdownValues.map((dropdownValue: string) => ` ${dropdownValue}`)
                }
              </span>
            `
            : ""
        }.`,
        document: {
          documentBeforeChange: params.excitationSystemColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.excitationSystemColumns[columnIndex].field;
      newColumns.isDefault = params.excitationSystemColumns[columnIndex].isDefault;
      newColumns.isHidden = params.excitationSystemColumns[columnIndex].isHidden;
      params.excitationSystemColumns[columnIndex] = newColumns;

      break;

    case "/generator":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Generator",
        operationType: "Update",
        date: new Date(),
        message: `Column <span style="font-weight: 610">${
          params.generatorColumns[columnIndex].title
        }</span> was updated for <span style="font-weight: 610">Generator</span> table. ${
          params.generatorColumns[columnIndex].title !== newColumns.title
            ? `It's new name is <span style="font-weight: 610">${newColumns.title}</span> and is`
            : `It is now`
        } of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
          newColumns.type === "dropdown"
            ? newColumns.tableRef
              ? `linked to <span style="font-weight: 610"> ${
                  newColumns.tableRef === "Bus"
                    ? params.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                    : params.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                } </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table.`
              : `having dropdown values:<span style="font-weight: 610">${
                  newColumns.dropdownValues &&
                  newColumns.dropdownValues.map((dropdownValue: string) => ` ${dropdownValue}`)
                }
              </span>
            `
            : ""
        }.`,
        document: {
          documentBeforeChange: params.generatorColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.generatorColumns[columnIndex].field;
      newColumns.isDefault = params.generatorColumns[columnIndex].isDefault;
      newColumns.isHidden = params.generatorColumns[columnIndex].isHidden;
      params.generatorColumns[columnIndex] = newColumns;

      break;

    case "/load":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Load",
        operationType: "Update",
        date: new Date(),
        message: `Column <span style="font-weight: 610">${
          params.loadsColumns[columnIndex].title
        }</span> was updated for <span style="font-weight: 610">Load</span> table. ${
          params.loadsColumns[columnIndex].title !== newColumns.title
            ? `It's new name is <span style="font-weight: 610">${newColumns.title}</span> and is`
            : `It is now`
        } of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
          newColumns.type === "dropdown"
            ? newColumns.tableRef
              ? `linked to <span style="font-weight: 610"> ${
                  newColumns.tableRef === "Bus"
                    ? params.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                    : params.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                } </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table.`
              : `having dropdown values:<span style="font-weight: 610">${
                  newColumns.dropdownValues &&
                  newColumns.dropdownValues.map((dropdownValue: string) => ` ${dropdownValue}`)
                }
              </span>
            `
            : ""
        }.`,
        document: {
          documentBeforeChange: params.loadsColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.loadsColumns[columnIndex].field;
      newColumns.isDefault = params.loadsColumns[columnIndex].isDefault;
      newColumns.isHidden = params.loadsColumns[columnIndex].isHidden;
      params.loadsColumns[columnIndex] = newColumns;

      break;

    case "/seriesCapacitor":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Series Capacitor",
        operationType: "Update",
        date: new Date(),
        message: `Column <span style="font-weight: 610">${
          params.seriesCapacitorColumns[columnIndex].title
        }</span> was updated for <span style="font-weight: 610">Series Capacitor</span> table. ${
          params.seriesCapacitorColumns[columnIndex].title !== newColumns.title
            ? `It's new name is <span style="font-weight: 610">${newColumns.title}</span> and is`
            : `It is now`
        } of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
          newColumns.type === "dropdown"
            ? newColumns.tableRef
              ? `linked to <span style="font-weight: 610"> ${
                  newColumns.tableRef === "Bus"
                    ? params.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                    : params.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                } </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table.`
              : `having dropdown values:<span style="font-weight: 610">${
                  newColumns.dropdownValues &&
                  newColumns.dropdownValues.map((dropdownValue: string) => ` ${dropdownValue}`)
                }
              </span>
            `
            : ""
        }.`,
        document: {
          documentBeforeChange: params.seriesCapacitorColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.seriesCapacitorColumns[columnIndex].field;
      newColumns.isDefault = params.seriesCapacitorColumns[columnIndex].isDefault;
      newColumns.isHidden = params.seriesCapacitorColumns[columnIndex].isHidden;
      params.seriesCapacitorColumns[columnIndex] = newColumns;

      break;

    case "/shuntCapacitor":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Shunt Capacitor",
        operationType: "Update",
        date: new Date(),
        message: `Column <span style="font-weight: 610">${
          params.shuntCapacitorColumns[columnIndex].title
        }</span> was updated for <span style="font-weight: 610">Shunt Capacitor</span> table. ${
          params.shuntCapacitorColumns[columnIndex].title !== newColumns.title
            ? `It's new name is <span style="font-weight: 610">${newColumns.title}</span> and is`
            : `It is now`
        } of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
          newColumns.type === "dropdown"
            ? newColumns.tableRef
              ? `linked to <span style="font-weight: 610"> ${
                  newColumns.tableRef === "Bus"
                    ? params.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                    : params.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                } </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table.`
              : `having dropdown values:<span style="font-weight: 610">${
                  newColumns.dropdownValues &&
                  newColumns.dropdownValues.map((dropdownValue: string) => ` ${dropdownValue}`)
                }
              </span>
            `
            : ""
        }.`,
        document: {
          documentBeforeChange: params.shuntCapacitorColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.shuntCapacitorColumns[columnIndex].field;
      newColumns.isDefault = params.shuntCapacitorColumns[columnIndex].isDefault;
      newColumns.isHidden = params.shuntCapacitorColumns[columnIndex].isHidden;
      params.shuntCapacitorColumns[columnIndex] = newColumns;

      break;

    case "/shuntReactor":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Shunt Reactor",
        operationType: "Update",
        date: new Date(),
        message: `Column <span style="font-weight: 610">${
          params.shuntReactorsColumns[columnIndex].title
        }</span> was updated for <span style="font-weight: 610">Shunt Reactor</span> table. ${
          params.shuntReactorsColumns[columnIndex].title !== newColumns.title
            ? `It's new name is <span style="font-weight: 610">${newColumns.title}</span> and is`
            : `It is now`
        } of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
          newColumns.type === "dropdown"
            ? newColumns.tableRef
              ? `linked to <span style="font-weight: 610"> ${
                  newColumns.tableRef === "Bus"
                    ? params.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                    : params.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                } </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table.`
              : `having dropdown values:<span style="font-weight: 610">${
                  newColumns.dropdownValues &&
                  newColumns.dropdownValues.map((dropdownValue: string) => ` ${dropdownValue}`)
                }
              </span>
            `
            : ""
        }.`,
        document: {
          documentBeforeChange: params.shuntReactorsColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.shuntReactorsColumns[columnIndex].field;
      newColumns.isDefault = params.shuntReactorsColumns[columnIndex].isDefault;
      newColumns.isHidden = params.shuntReactorsColumns[columnIndex].isHidden;
      params.shuntReactorsColumns[columnIndex] = newColumns;

      break;

    case "/singleLineDiagram":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Single Line Diagram",
        operationType: "Update",
        date: new Date(),
        message: `Column <span style="font-weight: 610">${
          params.singleLineDiagramsColumns[columnIndex].title
        }</span> was updated for <span style="font-weight: 610">Single Line Diagram</span> table. ${
          params.singleLineDiagramsColumns[columnIndex].title !== newColumns.title
            ? `It's new name is <span style="font-weight: 610">${newColumns.title}</span> and is`
            : `It is now`
        } of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
          newColumns.type === "dropdown"
            ? newColumns.tableRef
              ? `linked to <span style="font-weight: 610"> ${
                  newColumns.tableRef === "Bus"
                    ? params.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                    : params.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                } </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table.`
              : `having dropdown values:<span style="font-weight: 610">${
                  newColumns.dropdownValues &&
                  newColumns.dropdownValues.map((dropdownValue: string) => ` ${dropdownValue}`)
                }
              </span>
            `
            : ""
        }.`,
        document: {
          documentBeforeChange: params.singleLineDiagramsColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.singleLineDiagramsColumns[columnIndex].field;
      newColumns.isDefault = params.singleLineDiagramsColumns[columnIndex].isDefault;
      newColumns.isHidden = params.singleLineDiagramsColumns[columnIndex].isHidden;
      params.singleLineDiagramsColumns[columnIndex] = newColumns;

      break;

    case "/transformersThreeWinding":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Transformers Three Winding",
        operationType: "Update",
        date: new Date(),
        message: `Column <span style="font-weight: 610">${
          params.transformersThreeWindingColumns[columnIndex].title
        }</span> was updated for <span style="font-weight: 610">Transformers Three Winding</span> table. ${
          params.transformersThreeWindingColumns[columnIndex].title !== newColumns.title
            ? `It's new name is <span style="font-weight: 610">${newColumns.title}</span> and is`
            : `It is now`
        } of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
          newColumns.type === "dropdown"
            ? newColumns.tableRef
              ? `linked to <span style="font-weight: 610"> ${
                  newColumns.tableRef === "Bus"
                    ? params.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                    : params.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                } </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table.`
              : `having dropdown values:<span style="font-weight: 610">${
                  newColumns.dropdownValues &&
                  newColumns.dropdownValues.map((dropdownValue: string) => ` ${dropdownValue}`)
                }
              </span>
            `
            : ""
        }.`,
        document: {
          documentBeforeChange: params.transformersThreeWindingColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.transformersThreeWindingColumns[columnIndex].field;
      newColumns.isDefault = params.transformersThreeWindingColumns[columnIndex].isDefault;
      newColumns.isHidden = params.transformersThreeWindingColumns[columnIndex].isHidden;
      params.transformersThreeWindingColumns[columnIndex] = newColumns;

      break;

    case "/transformersTwoWinding":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Transformers Two Winding",
        operationType: "Update",
        date: new Date(),
        message: `Column <span style="font-weight: 610">${
          params.transformersTwoWindingColumns[columnIndex].title
        }</span> was updated for <span style="font-weight: 610">Transformers Two Winding</span> table. ${
          params.transformersTwoWindingColumns[columnIndex].title !== newColumns.title
            ? `It's new name is <span style="font-weight: 610">${newColumns.title}</span> and is`
            : `It is now`
        } of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
          newColumns.type === "dropdown"
            ? newColumns.tableRef
              ? `linked to <span style="font-weight: 610"> ${
                  newColumns.tableRef === "Bus"
                    ? params.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                    : params.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                } </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table.`
              : `having dropdown values:<span style="font-weight: 610">${
                  newColumns.dropdownValues &&
                  newColumns.dropdownValues.map((dropdownValue: string) => ` ${dropdownValue}`)
                }
              </span>
            `
            : ""
        }.`,
        document: {
          documentBeforeChange: params.transformersTwoWindingColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.transformersTwoWindingColumns[columnIndex].field;
      newColumns.isDefault = params.transformersTwoWindingColumns[columnIndex].isDefault;
      newColumns.isHidden = params.transformersTwoWindingColumns[columnIndex].isHidden;
      params.transformersTwoWindingColumns[columnIndex] = newColumns;

      break;

    case "/transmissionLine":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Transmission Line",
        operationType: "Update",
        date: new Date(),
        message: `Column <span style="font-weight: 610">${
          params.transmissionLinesColumns[columnIndex].title
        }</span> was updated for <span style="font-weight: 610">Transmission Line</span> table. ${
          params.transmissionLinesColumns[columnIndex].title !== newColumns.title
            ? `It's new name is <span style="font-weight: 610">${newColumns.title}</span> and is`
            : `It is now`
        } of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
          newColumns.type === "dropdown"
            ? newColumns.tableRef
              ? `linked to <span style="font-weight: 610"> ${
                  newColumns.tableRef === "Bus"
                    ? params.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                    : params.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                } </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table.`
              : `having dropdown values:<span style="font-weight: 610">${
                  newColumns.dropdownValues &&
                  newColumns.dropdownValues.map((dropdownValue: string) => ` ${dropdownValue}`)
                }
              </span>
            `
            : ""
        }.`,
        document: {
          documentBeforeChange: params.transmissionLinesColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.transmissionLinesColumns[columnIndex].field;
      newColumns.isDefault = params.transmissionLinesColumns[columnIndex].isDefault;
      newColumns.isHidden = params.transmissionLinesColumns[columnIndex].isHidden;
      params.transmissionLinesColumns[columnIndex] = newColumns;

      break;

    case "/turbineGovernor":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Turbine Governor",
        operationType: "Update",
        date: new Date(),
        message: `Column <span style="font-weight: 610">${
          params.turbineGovernorColumns[columnIndex].title
        }</span> was updated for <span style="font-weight: 610">Turbine Governor</span> table. ${
          params.turbineGovernorColumns[columnIndex].title !== newColumns.title
            ? `It's new name is <span style="font-weight: 610">${newColumns.title}</span> and is`
            : `It is now`
        } of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
          newColumns.type === "dropdown"
            ? newColumns.tableRef
              ? `linked to <span style="font-weight: 610"> ${
                  newColumns.tableRef === "Bus"
                    ? params.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                    : params.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                } </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table.`
              : `having dropdown values:<span style="font-weight: 610">${
                  newColumns.dropdownValues &&
                  newColumns.dropdownValues.map((dropdownValue: string) => ` ${dropdownValue}`)
                }
              </span>
            `
            : ""
        }.`,
        document: {
          documentBeforeChange: params.turbineGovernorColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.turbineGovernorColumns[columnIndex].field;
      newColumns.isDefault = params.turbineGovernorColumns[columnIndex].isDefault;
      newColumns.isHidden = params.turbineGovernorColumns[columnIndex].isHidden;
      params.turbineGovernorColumns[columnIndex] = newColumns;

      break;

    case "/ibr":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "IBR",
        operationType: "Update",
        date: new Date(),
        message: `Column <span style="font-weight: 610">${
          params.ibrColumns[columnIndex].title
        }</span> was updated for <span style="font-weight: 610">IBR</span> table. ${
          params.ibrColumns[columnIndex].title !== newColumns.title
            ? `It's new name is <span style="font-weight: 610">${newColumns.title}</span> and is`
            : `It is now`
        } of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
          newColumns.type === "dropdown"
            ? newColumns.tableRef
              ? `linked to <span style="font-weight: 610"> ${
                  newColumns.tableRef === "Bus"
                    ? params.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                    : params.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                } </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table.`
              : `having dropdown values:<span style="font-weight: 610">${
                  newColumns.dropdownValues &&
                  newColumns.dropdownValues.map((dropdownValue: string) => ` ${dropdownValue}`)
                }
              </span>
            `
            : ""
        }.`,
        document: {
          documentBeforeChange: params.ibrColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.ibrColumns[columnIndex].field;
      newColumns.isDefault = params.ibrColumns[columnIndex].isDefault;
      newColumns.isHidden = params.ibrColumns[columnIndex].isHidden;
      params.ibrColumns[columnIndex] = newColumns;

      break;

    case "/lccHVDCLink":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "LCC-HVDC Link",
        operationType: "Update",
        date: new Date(),
        message: `Column <span style="font-weight: 610">${
          params.lccHVDCLinkColumns[columnIndex].title
        }</span> was updated for <span style="font-weight: 610">LCC-HVDC Link</span> table. ${
          params.lccHVDCLinkColumns[columnIndex].title !== newColumns.title
            ? `It's new name is <span style="font-weight: 610">${newColumns.title}</span> and is`
            : `It is now`
        } of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
          newColumns.type === "dropdown"
            ? newColumns.tableRef
              ? `linked to <span style="font-weight: 610"> ${
                  newColumns.tableRef === "Bus"
                    ? params.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                    : params.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                } </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table.`
              : `having dropdown values:<span style="font-weight: 610">${
                  newColumns.dropdownValues &&
                  newColumns.dropdownValues.map((dropdownValue: string) => ` ${dropdownValue}`)
                }
              </span>
            `
            : ""
        }.`,
        document: {
          documentBeforeChange: params.lccHVDCLinkColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.lccHVDCLinkColumns[columnIndex].field;
      newColumns.isDefault = params.lccHVDCLinkColumns[columnIndex].isDefault;
      newColumns.isHidden = params.lccHVDCLinkColumns[columnIndex].isHidden;
      params.lccHVDCLinkColumns[columnIndex] = newColumns;

      break;

    case "/seriesFact":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Series Fact",
        operationType: "Update",
        date: new Date(),
        message: `Column <span style="font-weight: 610">${
          params.seriesFactsColumns[columnIndex].title
        }</span> was updated for <span style="font-weight: 610">Series Fact</span> table. ${
          params.seriesFactsColumns[columnIndex].title !== newColumns.title
            ? `It's new name is <span style="font-weight: 610">${newColumns.title}</span> and is`
            : `It is now`
        } of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
          newColumns.type === "dropdown"
            ? newColumns.tableRef
              ? `linked to <span style="font-weight: 610"> ${
                  newColumns.tableRef === "Bus"
                    ? params.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                    : params.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                } </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table.`
              : `having dropdown values:<span style="font-weight: 610">${
                  newColumns.dropdownValues &&
                  newColumns.dropdownValues.map((dropdownValue: string) => ` ${dropdownValue}`)
                }
              </span>
            `
            : ""
        }.`,
        document: {
          documentBeforeChange: params.seriesFactsColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.seriesFactsColumns[columnIndex].field;
      newColumns.isDefault = params.seriesFactsColumns[columnIndex].isDefault;
      newColumns.isHidden = params.seriesFactsColumns[columnIndex].isHidden;
      params.seriesFactsColumns[columnIndex] = newColumns;

      break;

    case "/shuntFact":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "Shunt Fact",
        operationType: "Update",
        date: new Date(),
        message: `Column <span style="font-weight: 610">${
          params.shuntFactsColumns[columnIndex].title
        }</span> was updated for <span style="font-weight: 610">Shunt Fact</span> table. ${
          params.shuntFactsColumns[columnIndex].title !== newColumns.title
            ? `It's new name is <span style="font-weight: 610">${newColumns.title}</span> and is`
            : `It is now`
        } of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
          newColumns.type === "dropdown"
            ? newColumns.tableRef
              ? `linked to <span style="font-weight: 610"> ${
                  newColumns.tableRef === "Bus"
                    ? params.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                    : params.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                } </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table.`
              : `having dropdown values:<span style="font-weight: 610">${
                  newColumns.dropdownValues &&
                  newColumns.dropdownValues.map((dropdownValue: string) => ` ${dropdownValue}`)
                }
              </span>
            `
            : ""
        }.`,
        document: {
          documentBeforeChange: params.shuntFactsColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.shuntFactsColumns[columnIndex].field;
      newColumns.isDefault = params.shuntFactsColumns[columnIndex].isDefault;
      newColumns.isHidden = params.shuntFactsColumns[columnIndex].isHidden;
      params.shuntFactsColumns[columnIndex] = newColumns;

      break;

    case "/vscHVDCLink":
      modificationHistory = {
        userId: new ObjectId(userId),
        databaseName: "VSC-HVDC Link",
        operationType: "Update",
        date: new Date(),
        message: `Column <span style="font-weight: 610">${
          params.vscHVDCLinkColumns[columnIndex].title
        }</span> was updated for <span style="font-weight: 610">VSC-HVDC Link</span> table. ${
          params.vscHVDCLinkColumns[columnIndex].title !== newColumns.title
            ? `It's new name is <span style="font-weight: 610">${newColumns.title}</span> and is`
            : `It is now`
        } of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
          newColumns.type === "dropdown"
            ? newColumns.tableRef
              ? `linked to <span style="font-weight: 610"> ${
                  newColumns.tableRef === "Bus"
                    ? params.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                    : params.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                } </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table.`
              : `having dropdown values:<span style="font-weight: 610">${
                  newColumns.dropdownValues &&
                  newColumns.dropdownValues.map((dropdownValue: string) => ` ${dropdownValue}`)
                }
              </span>
            `
            : ""
        }.`,
        document: {
          documentBeforeChange: params.vscHVDCLinkColumns[columnIndex],
          documentAfterChange: newColumns,
        },
      };
      newColumns.field = params.vscHVDCLinkColumns[columnIndex].field;
      newColumns.isDefault = params.vscHVDCLinkColumns[columnIndex].isDefault;
      newColumns.isHidden = params.vscHVDCLinkColumns[columnIndex].isHidden;
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
          isHidden: false,
        };
      } else {
        const dropdownValues = columnDetails.dropdownValues!.map((item: { name: string }) => item.name);
        newColumns = {
          field: columnFieldName,
          title: columnDetails.name,
          type: columnDetails.type,
          dropdownValues: dropdownValues,
          isDefault: false,
          isHidden: false,
        };
      }
    } else {
      newColumns = {
        field: columnFieldName,
        title: columnDetails.name,
        type: columnDetails.type!,
        isDefault: false,
        isHidden: false,
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
          message: `New column named <span style="font-weight: 610">${
            newColumns.title
          }</span> of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
            newColumns.type === "dropdown"
              ? newColumns.tableRef
                ? `linked to <span style="font-weight: 610">
                  ${
                    newColumns.tableRef === "Bus"
                      ? newParams.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                      : newParams.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                  }
                </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table`
                : `having dropdown values:<span style="font-weight: 610">${
                    newColumns.dropdownValues &&
                    newColumns.dropdownValues.map(
                      (dropdownValue: string) => `<span style="font-weight: 610"> ${dropdownValue}</span>`
                    )
                  }
                </span>`
              : ""
          } was added to <span style="font-weight: 610">Bus</span>.`,
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
          message: `New column named <span style="font-weight: 610">${
            newColumns.title
          }</span> of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
            newColumns.type === "dropdown"
              ? newColumns.tableRef
                ? `linked to <span style="font-weight: 610">
                  ${
                    newColumns.tableRef === "Bus"
                      ? newParams.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                      : newParams.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                  }
                </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table`
                : `having dropdown values:<span style="font-weight: 610">${
                    newColumns.dropdownValues &&
                    newColumns.dropdownValues.map(
                      (dropdownValue: string) => `<span style="font-weight: 610"> ${dropdownValue}</span>`
                    )
                  }
                </span>`
              : ""
          } was added to <span style="font-weight: 610">Excitation System</span>.`,
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
          message: `New column named <span style="font-weight: 610">${
            newColumns.title
          }</span> of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
            newColumns.type === "dropdown"
              ? newColumns.tableRef
                ? `linked to <span style="font-weight: 610">
                  ${
                    newColumns.tableRef === "Bus"
                      ? newParams.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                      : newParams.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                  }
                </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table`
                : `having dropdown values:<span style="font-weight: 610">${
                    newColumns.dropdownValues &&
                    newColumns.dropdownValues.map(
                      (dropdownValue: string) => `<span style="font-weight: 610"> ${dropdownValue}</span>`
                    )
                  }
                </span>`
              : ""
          } was added to <span style="font-weight: 610">Generator</span>.`,
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
          message: `New column named <span style="font-weight: 610">${
            newColumns.title
          }</span> of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
            newColumns.type === "dropdown"
              ? newColumns.tableRef
                ? `linked to <span style="font-weight: 610">
                  ${
                    newColumns.tableRef === "Bus"
                      ? newParams.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                      : newParams.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                  }
                </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table`
                : `having dropdown values:<span style="font-weight: 610">${
                    newColumns.dropdownValues &&
                    newColumns.dropdownValues.map(
                      (dropdownValue: string) => `<span style="font-weight: 610"> ${dropdownValue}</span>`
                    )
                  }
                </span>`
              : ""
          } was added to <span style="font-weight: 610">Load</span>.`,
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
          message: `New column named <span style="font-weight: 610">${
            newColumns.title
          }</span> of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
            newColumns.type === "dropdown"
              ? newColumns.tableRef
                ? `linked to <span style="font-weight: 610">
                  ${
                    newColumns.tableRef === "Bus"
                      ? newParams.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                      : newParams.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                  }
                </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table`
                : `having dropdown values:<span style="font-weight: 610">${
                    newColumns.dropdownValues &&
                    newColumns.dropdownValues.map(
                      (dropdownValue: string) => `<span style="font-weight: 610"> ${dropdownValue}</span>`
                    )
                  }
                </span>`
              : ""
          } was added to <span style="font-weight: 610">Series Capacitor</span>.`,
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
          message: `New column named <span style="font-weight: 610">${
            newColumns.title
          }</span> of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
            newColumns.type === "dropdown"
              ? newColumns.tableRef
                ? `linked to <span style="font-weight: 610">
                  ${
                    newColumns.tableRef === "Bus"
                      ? newParams.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                      : newParams.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                  }
                </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table`
                : `having dropdown values:<span style="font-weight: 610">${
                    newColumns.dropdownValues &&
                    newColumns.dropdownValues.map(
                      (dropdownValue: string) => `<span style="font-weight: 610"> ${dropdownValue}</span>`
                    )
                  }
                </span>`
              : ""
          } was added to <span style="font-weight: 610">Shunt Capacitor</span>.`,
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
          message: `New column named <span style="font-weight: 610">${
            newColumns.title
          }</span> of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
            newColumns.type === "dropdown"
              ? newColumns.tableRef
                ? `linked to <span style="font-weight: 610">
                  ${
                    newColumns.tableRef === "Bus"
                      ? newParams.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                      : newParams.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                  }
                </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table`
                : `having dropdown values:<span style="font-weight: 610">${
                    newColumns.dropdownValues &&
                    newColumns.dropdownValues.map(
                      (dropdownValue: string) => `<span style="font-weight: 610"> ${dropdownValue}</span>`
                    )
                  }
                </span>`
              : ""
          } was added to <span style="font-weight: 610">Shunt Reactor</span>.`,
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
          message: `New column named <span style="font-weight: 610">${
            newColumns.title
          }</span> of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
            newColumns.type === "dropdown"
              ? newColumns.tableRef
                ? `linked to <span style="font-weight: 610">
                  ${
                    newColumns.tableRef === "Bus"
                      ? newParams.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                      : newParams.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                  }
                </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table`
                : `having dropdown values:<span style="font-weight: 610">${
                    newColumns.dropdownValues &&
                    newColumns.dropdownValues.map(
                      (dropdownValue: string) => `<span style="font-weight: 610"> ${dropdownValue}</span>`
                    )
                  }
                </span>`
              : ""
          } was added to <span style="font-weight: 610">Single Line Diagram</span>.`,
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
          message: `New column named <span style="font-weight: 610">${
            newColumns.title
          }</span> of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
            newColumns.type === "dropdown"
              ? newColumns.tableRef
                ? `linked to <span style="font-weight: 610">
                  ${
                    newColumns.tableRef === "Bus"
                      ? newParams.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                      : newParams.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                  }
                </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table`
                : `having dropdown values:<span style="font-weight: 610">${
                    newColumns.dropdownValues &&
                    newColumns.dropdownValues.map(
                      (dropdownValue: string) => `<span style="font-weight: 610"> ${dropdownValue}</span>`
                    )
                  }
                </span>`
              : ""
          } was added to <span style="font-weight: 610">Transformers Three Winding</span>.`,
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
          message: `New column named <span style="font-weight: 610">${
            newColumns.title
          }</span> of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
            newColumns.type === "dropdown"
              ? newColumns.tableRef
                ? `linked to <span style="font-weight: 610">
                  ${
                    newColumns.tableRef === "Bus"
                      ? newParams.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                      : newParams.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                  }
                </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table`
                : `having dropdown values:<span style="font-weight: 610">${
                    newColumns.dropdownValues &&
                    newColumns.dropdownValues.map(
                      (dropdownValue: string) => `<span style="font-weight: 610"> ${dropdownValue}</span>`
                    )
                  }
                </span>`
              : ""
          } was added to <span style="font-weight: 610">Transformers Two Winding</span>.`,
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
          message: `New column named <span style="font-weight: 610">${
            newColumns.title
          }</span> of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
            newColumns.type === "dropdown"
              ? newColumns.tableRef
                ? `linked to <span style="font-weight: 610">
                  ${
                    newColumns.tableRef === "Bus"
                      ? newParams.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                      : newParams.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                  }
                </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table`
                : `having dropdown values:<span style="font-weight: 610">${
                    newColumns.dropdownValues &&
                    newColumns.dropdownValues.map(
                      (dropdownValue: string) => `<span style="font-weight: 610"> ${dropdownValue}</span>`
                    )
                  }
                </span>`
              : ""
          } was added to <span style="font-weight: 610">Transmission Line</span>.`,
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
          message: `New column named <span style="font-weight: 610">${
            newColumns.title
          }</span> of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
            newColumns.type === "dropdown"
              ? newColumns.tableRef
                ? `linked to <span style="font-weight: 610">
                  ${
                    newColumns.tableRef === "Bus"
                      ? newParams.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                      : newParams.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                  }
                </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table`
                : `having dropdown values:<span style="font-weight: 610">${
                    newColumns.dropdownValues &&
                    newColumns.dropdownValues.map(
                      (dropdownValue: string) => `<span style="font-weight: 610"> ${dropdownValue}</span>`
                    )
                  }
                </span>`
              : ""
          } was added to <span style="font-weight: 610">Turbine Governor</span>.`,
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
          message: `New column named <span style="font-weight: 610">${
            newColumns.title
          }</span> of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
            newColumns.type === "dropdown"
              ? newColumns.tableRef
                ? `linked to <span style="font-weight: 610">
                  ${
                    newColumns.tableRef === "Bus"
                      ? newParams.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                      : newParams.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                  }
                </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table`
                : `having dropdown values:<span style="font-weight: 610">${
                    newColumns.dropdownValues &&
                    newColumns.dropdownValues.map(
                      (dropdownValue: string) => `<span style="font-weight: 610"> ${dropdownValue}</span>`
                    )
                  }
                </span>`
              : ""
          } was added to <span style="font-weight: 610">IBR</span>.`,
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
          message: `New column named <span style="font-weight: 610">${
            newColumns.title
          }</span> of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
            newColumns.type === "dropdown"
              ? newColumns.tableRef
                ? `linked to <span style="font-weight: 610">
                  ${
                    newColumns.tableRef === "Bus"
                      ? newParams.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                      : newParams.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                  }
                </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table`
                : `having dropdown values:<span style="font-weight: 610">${
                    newColumns.dropdownValues &&
                    newColumns.dropdownValues.map(
                      (dropdownValue: string) => `<span style="font-weight: 610"> ${dropdownValue}</span>`
                    )
                  }
                </span>`
              : ""
          } was added to <span style="font-weight: 610">LCC-HVDC Link</span>.`,
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
          message: `New column named <span style="font-weight: 610">${
            newColumns.title
          }</span> of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
            newColumns.type === "dropdown"
              ? newColumns.tableRef
                ? `linked to <span style="font-weight: 610">
                  ${
                    newColumns.tableRef === "Bus"
                      ? newParams.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                      : newParams.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                  }
                </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table`
                : `having dropdown values:<span style="font-weight: 610">${
                    newColumns.dropdownValues &&
                    newColumns.dropdownValues.map(
                      (dropdownValue: string) => `<span style="font-weight: 610"> ${dropdownValue}</span>`
                    )
                  }
                </span>`
              : ""
          } was added to <span style="font-weight: 610">Series Fact</span>.`,
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
          message: `New column named <span style="font-weight: 610">${
            newColumns.title
          }</span> of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
            newColumns.type === "dropdown"
              ? newColumns.tableRef
                ? `linked to <span style="font-weight: 610">
                  ${
                    newColumns.tableRef === "Bus"
                      ? newParams.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                      : newParams.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                  }
                </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table`
                : `having dropdown values:<span style="font-weight: 610">${
                    newColumns.dropdownValues &&
                    newColumns.dropdownValues.map(
                      (dropdownValue: string) => `<span style="font-weight: 610"> ${dropdownValue}</span>`
                    )
                  }
                </span>`
              : ""
          } was added to <span style="font-weight: 610">Shunt Fact</span>.`,
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
          message: `New column named <span style="font-weight: 610">${
            newColumns.title
          }</span> of type <span style="font-weight: 610">${reverseUnslug(newColumns.type)}</span> ${
            newColumns.type === "dropdown"
              ? newColumns.tableRef
                ? `linked to <span style="font-weight: 610">
                  ${
                    newColumns.tableRef === "Bus"
                      ? newParams.busColumns?.find((column) => column.field === newColumns.columnRef)?.title
                      : newParams.generatorColumns?.find((column) => column.field === newColumns.columnRef)?.title
                  }
                </span> of <span style="font-weight: 610">${newColumns.tableRef}</span> table`
                : `having dropdown values:<span style="font-weight: 610">${
                    newColumns.dropdownValues &&
                    newColumns.dropdownValues.map(
                      (dropdownValue: string) => `<span style="font-weight: 610"> ${dropdownValue}</span>`
                    )
                  }
                </span>`
              : ""
          } was added to <span style="font-weight: 610">VSC-HVDC Link</span>.`,
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
  operationType: "Hide-One" | "Hide-Many" | "Update-Many",
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
          message: `${
            operationType === "Hide-One"
              ? `Column <span style="font-weight: 610">${params.busColumns[columnIndex].title}</span> was removed`
              : operationType === "Hide-Many"
              ? `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.busColumns.find((changedColumn) => changedColumn.title == item.title)?.isHidden !==
                      item.isHidden
                    ) {
                      return `<span style="font-weight: 610">${item.title},</span>`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")} was/were removed`
              : `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.busColumns.find((changedColumn) => changedColumn.title == item.title)?.isHidden !==
                      item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title}</span> was ${
                        item.isHidden
                          ? `<span style="font-weight: 610">Removed, </span>`
                          : `<span style="font-weight: 610">Restored, </span>`
                      }`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")}`
          } from <span style="font-weight: 610">Bus</span> table.`,
          document: {
            documentBeforeChange: operationType === "Hide-One" ? params.busColumns[columnIndex] : params.busColumns,
            documentAfterChange: operationType === "Hide-One" ? null : newColumns,
          },
        };
        if (operationType === "Hide-One") params.busColumns[columnIndex].isHidden = true;
        else params.busColumns = newColumns!;

        break;

      case "/excitationSystem":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Excitation system",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          message: `${
            operationType === "Hide-One"
              ? `Column <span style="font-weight: 610">${params.excitationSystemColumns[columnIndex].title}</span> was removed`
              : operationType === "Hide-Many"
              ? `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.excitationSystemColumns.find((changedColumn) => changedColumn.title == item.title)
                        ?.isHidden !== item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title},</span>`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")} was/were removed`
              : `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.excitationSystemColumns.find((changedColumn) => changedColumn.title == item.title)
                        ?.isHidden !== item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title}</span> was ${
                        item.isHidden
                          ? `<span style="font-weight: 610">Removed, </span>`
                          : `<span style="font-weight: 610">Restored, </span>`
                      }`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")}`
          } from <span style="font-weight: 610">Excitation system</span> table.`,
          document: {
            documentBeforeChange:
              operationType === "Hide-One"
                ? params.excitationSystemColumns[columnIndex]
                : params.excitationSystemColumns,
            documentAfterChange: operationType === "Hide-One" ? null : newColumns,
          },
        };
        if (operationType === "Hide-One") params.excitationSystemColumns[columnIndex].isHidden = true;
        else params.excitationSystemColumns = newColumns!;
        break;

      case "/generator":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Generator",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          message: `${
            operationType === "Hide-One"
              ? `Column <span style="font-weight: 610">${params.generatorColumns[columnIndex].title}</span> was removed`
              : operationType === "Hide-Many"
              ? `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.generatorColumns.find((changedColumn) => changedColumn.title == item.title)?.isHidden !==
                      item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title},</span>`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")} was/were removed`
              : `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.generatorColumns.find((changedColumn) => changedColumn.title == item.title)?.isHidden !==
                      item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title}</span> was ${
                        item.isHidden
                          ? `<span style="font-weight: 610">Removed, </span>`
                          : `<span style="font-weight: 610">Restored, </span>`
                      }`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")}`
          } from <span style="font-weight: 610">Generator</span> table.`,
          document: {
            documentBeforeChange:
              operationType === "Hide-One" ? params.generatorColumns[columnIndex] : params.generatorColumns,
            documentAfterChange: operationType === "Hide-One" ? null : newColumns,
          },
        };
        if (operationType === "Hide-One") params.generatorColumns[columnIndex].isHidden = true;
        else params.generatorColumns = newColumns!;
        break;

      case "/load":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Load",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          message: `${
            operationType === "Hide-One"
              ? `Column <span style="font-weight: 610">${params.loadsColumns[columnIndex].title}</span> was removed`
              : operationType === "Hide-Many"
              ? `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.loadsColumns.find((changedColumn) => changedColumn.title == item.title)?.isHidden !==
                      item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title},</span>`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")} was/were removed`
              : `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.loadsColumns.find((changedColumn) => changedColumn.title == item.title)?.isHidden !==
                      item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title}</span> was ${
                        item.isHidden
                          ? `<span style="font-weight: 610">Removed, </span>`
                          : `<span style="font-weight: 610">Restored, </span>`
                      }`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")}`
          } from <span style="font-weight: 610">Load</span> table.`,
          document: {
            documentBeforeChange: operationType === "Hide-One" ? params.loadsColumns[columnIndex] : params.loadsColumns,
            documentAfterChange: operationType === "Hide-One" ? null : newColumns,
          },
        };
        if (operationType === "Hide-One") params.loadsColumns[columnIndex].isHidden = true;
        else params.loadsColumns = newColumns!;
        break;

      case "/seriesCapacitor":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Series Capacitor",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          message: `${
            operationType === "Hide-One"
              ? `Column <span style="font-weight: 610">${params.seriesCapacitorColumns[columnIndex].title}</span> was removed`
              : operationType === "Hide-Many"
              ? `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.seriesCapacitorColumns.find((changedColumn) => changedColumn.title == item.title)
                        ?.isHidden !== item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title},</span>`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")} was/were removed`
              : `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.seriesCapacitorColumns.find((changedColumn) => changedColumn.title == item.title)
                        ?.isHidden !== item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title}</span> was ${
                        item.isHidden
                          ? `<span style="font-weight: 610">Removed, </span>`
                          : `<span style="font-weight: 610">Restored, </span>`
                      }`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")}`
          } from <span style="font-weight: 610">Series Capacitor</span> table.`,
          document: {
            documentBeforeChange:
              operationType === "Hide-One" ? params.seriesCapacitorColumns[columnIndex] : params.seriesCapacitorColumns,
            documentAfterChange: operationType === "Hide-One" ? null : newColumns,
          },
        };
        if (operationType === "Hide-One") params.seriesCapacitorColumns[columnIndex].isHidden = true;
        else params.seriesCapacitorColumns = newColumns!;
        break;

      case "/shuntCapacitor":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Shunt Capacitor",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          message: `${
            operationType === "Hide-One"
              ? `Column <span style="font-weight: 610">${params.shuntCapacitorColumns[columnIndex].title}</span> was removed`
              : operationType === "Hide-Many"
              ? `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.shuntCapacitorColumns.find((changedColumn) => changedColumn.title == item.title)
                        ?.isHidden !== item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title},</span>`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")} was/were removed`
              : `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.shuntCapacitorColumns.find((changedColumn) => changedColumn.title == item.title)
                        ?.isHidden !== item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title}</span> was ${
                        item.isHidden
                          ? `<span style="font-weight: 610">Removed, </span>`
                          : `<span style="font-weight: 610">Restored, </span>`
                      }`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")}`
          } from <span style="font-weight: 610">Shunt Capacitor</span> table.`,
          document: {
            documentBeforeChange:
              operationType === "Hide-One" ? params.shuntCapacitorColumns[columnIndex] : params.shuntCapacitorColumns,
            documentAfterChange: operationType === "Hide-One" ? null : newColumns,
          },
        };
        if (operationType === "Hide-One") params.shuntCapacitorColumns[columnIndex].isHidden = true;
        else params.shuntCapacitorColumns = newColumns!;
        break;

      case "/shuntReactor":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Shunt Reactor",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          message: `${
            operationType === "Hide-One"
              ? `Column <span style="font-weight: 610">${params.shuntReactorsColumns[columnIndex].title}</span> was removed`
              : operationType === "Hide-Many"
              ? `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.shuntReactorsColumns.find((changedColumn) => changedColumn.title == item.title)
                        ?.isHidden !== item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title},</span>`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")} was/were removed`
              : `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.shuntReactorsColumns.find((changedColumn) => changedColumn.title == item.title)
                        ?.isHidden !== item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title}</span> was ${
                        item.isHidden
                          ? `<span style="font-weight: 610">Removed, </span>`
                          : `<span style="font-weight: 610">Restored, </span>`
                      }`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")}`
          } from <span style="font-weight: 610">Shunt Reactor</span> table.`,
          document: {
            documentBeforeChange:
              operationType === "Hide-One" ? params.shuntReactorsColumns[columnIndex] : params.shuntReactorsColumns,
            documentAfterChange: operationType === "Hide-One" ? null : newColumns,
          },
        };
        if (operationType === "Hide-One") params.shuntReactorsColumns[columnIndex].isHidden = true;
        else params.shuntReactorsColumns = newColumns!;
        break;

      case "/singleLineDiagram":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Single Line Diagram",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          message: `${
            operationType === "Hide-One"
              ? `Column <span style="font-weight: 610">${params.singleLineDiagramsColumns[columnIndex].title}</span> was removed`
              : operationType === "Hide-Many"
              ? `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.singleLineDiagramsColumns.find((changedColumn) => changedColumn.title == item.title)
                        ?.isHidden !== item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title},</span>`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")} was/were removed`
              : `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.singleLineDiagramsColumns.find((changedColumn) => changedColumn.title == item.title)
                        ?.isHidden !== item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title}</span> was ${
                        item.isHidden
                          ? `<span style="font-weight: 610">Removed, </span>`
                          : `<span style="font-weight: 610">Restored, </span>`
                      }`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")}`
          } from <span style="font-weight: 610">Single Line Diagram</span> table.`,
          document: {
            documentBeforeChange:
              operationType === "Hide-One"
                ? params.singleLineDiagramsColumns[columnIndex]
                : params.singleLineDiagramsColumns,
            documentAfterChange: operationType === "Hide-One" ? null : newColumns,
          },
        };
        if (operationType === "Hide-One") params.singleLineDiagramsColumns[columnIndex].isHidden = true;
        else params.singleLineDiagramsColumns = newColumns!;
        break;

      case "/transformersThreeWinding":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Transformers Three Winding",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          message: `${
            operationType === "Hide-One"
              ? `Column <span style="font-weight: 610">${params.transformersThreeWindingColumns[columnIndex].title}</span> was removed`
              : operationType === "Hide-Many"
              ? `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.transformersThreeWindingColumns.find((changedColumn) => changedColumn.title == item.title)
                        ?.isHidden !== item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title},</span>`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")} was/were removed`
              : `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.transformersThreeWindingColumns.find((changedColumn) => changedColumn.title == item.title)
                        ?.isHidden !== item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title}</span> was ${
                        item.isHidden
                          ? `<span style="font-weight: 610">Removed, </span>`
                          : `<span style="font-weight: 610">Restored, </span>`
                      }`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")}`
          } from <span style="font-weight: 610">Transformers Three Winding</span> table.`,
          document: {
            documentBeforeChange:
              operationType === "Hide-One"
                ? params.transformersThreeWindingColumns[columnIndex]
                : params.transformersThreeWindingColumns,
            documentAfterChange: operationType === "Hide-One" ? null : newColumns,
          },
        };
        if (operationType === "Hide-One") params.transformersThreeWindingColumns[columnIndex].isHidden = true;
        else params.transformersThreeWindingColumns = newColumns!;
        break;

      case "/transformersTwoWinding":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Transformers Two Winding",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          message: `${
            operationType === "Hide-One"
              ? `Column <span style="font-weight: 610">${params.transformersTwoWindingColumns[columnIndex].title}</span> was removed`
              : operationType === "Hide-Many"
              ? `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.transformersTwoWindingColumns.find((changedColumn) => changedColumn.title == item.title)
                        ?.isHidden !== item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title},</span>`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")} was/were removed`
              : `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.transformersTwoWindingColumns.find((changedColumn) => changedColumn.title == item.title)
                        ?.isHidden !== item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title}</span> was ${
                        item.isHidden
                          ? `<span style="font-weight: 610">Removed, </span>`
                          : `<span style="font-weight: 610">Restored, </span>`
                      }`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")}`
          } from <span style="font-weight: 610">Transformers Two Winding</span> table.`,
          document: {
            documentBeforeChange:
              operationType === "Hide-One"
                ? params.transformersTwoWindingColumns[columnIndex]
                : params.transformersTwoWindingColumns,
            documentAfterChange: operationType === "Hide-One" ? null : newColumns,
          },
        };
        if (operationType === "Hide-One") params.transformersTwoWindingColumns[columnIndex].isHidden = true;
        else params.transformersTwoWindingColumns = newColumns!;
        break;

      case "/transmissionLine":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Transmission Line",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          message: `${
            operationType === "Hide-One"
              ? `Column <span style="font-weight: 610">${params.transmissionLinesColumns[columnIndex].title}</span> was removed`
              : operationType === "Hide-Many"
              ? `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.transmissionLinesColumns.find((changedColumn) => changedColumn.title == item.title)
                        ?.isHidden !== item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title},</span>`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")} was/were removed`
              : `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.transmissionLinesColumns.find((changedColumn) => changedColumn.title == item.title)
                        ?.isHidden !== item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title}</span> was ${
                        item.isHidden
                          ? `<span style="font-weight: 610">Removed, </span>`
                          : `<span style="font-weight: 610">Restored, </span>`
                      }`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")}`
          } from <span style="font-weight: 610">Transmission Line</span> table.`,
          document: {
            documentBeforeChange:
              operationType === "Hide-One"
                ? params.transmissionLinesColumns[columnIndex]
                : params.transmissionLinesColumns,
            documentAfterChange: operationType === "Hide-One" ? null : newColumns,
          },
        };
        if (operationType === "Hide-One") params.transmissionLinesColumns[columnIndex].isHidden = true;
        else params.transmissionLinesColumns = newColumns!;
        break;

      case "/turbineGovernor":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Turbine Governor",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          message: `${
            operationType === "Hide-One"
              ? `Column <span style="font-weight: 610">${params.turbineGovernorColumns[columnIndex].title}</span> was removed`
              : operationType === "Hide-Many"
              ? `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.turbineGovernorColumns.find((changedColumn) => changedColumn.title == item.title)
                        ?.isHidden !== item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title},</span>`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")} was/were removed`
              : `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.turbineGovernorColumns.find((changedColumn) => changedColumn.title == item.title)
                        ?.isHidden !== item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title}</span> was ${
                        item.isHidden
                          ? `<span style="font-weight: 610">Removed, </span>`
                          : `<span style="font-weight: 610">Restored, </span>`
                      }`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")}`
          } from <span style="font-weight: 610">Turbine Governor</span> table.`,
          document: {
            documentBeforeChange:
              operationType === "Hide-One" ? params.turbineGovernorColumns[columnIndex] : params.turbineGovernorColumns,
            documentAfterChange: operationType === "Hide-One" ? null : newColumns,
          },
        };
        if (operationType === "Hide-One") params.turbineGovernorColumns[columnIndex].isHidden = true;
        else params.turbineGovernorColumns = newColumns!;
        break;

      case "/ibr":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "IBR",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          message: `${
            operationType === "Hide-One"
              ? `Column <span style="font-weight: 610">${params.ibrColumns[columnIndex].title}</span> was removed`
              : operationType === "Hide-Many"
              ? `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.ibrColumns.find((changedColumn) => changedColumn.title == item.title)?.isHidden !==
                      item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title},</span>`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")} was/were removed`
              : `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.ibrColumns.find((changedColumn) => changedColumn.title == item.title)?.isHidden !==
                      item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title}</span> was ${
                        item.isHidden
                          ? `<span style="font-weight: 610">Removed, </span>`
                          : `<span style="font-weight: 610">Restored, </span>`
                      }`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")}`
          } from <span style="font-weight: 610">IBR</span> table.`,
          document: {
            documentBeforeChange: operationType === "Hide-One" ? params.ibrColumns[columnIndex] : params.ibrColumns,
            documentAfterChange: operationType === "Hide-One" ? null : newColumns,
          },
        };
        if (operationType === "Hide-One") params.ibrColumns[columnIndex].isHidden = true;
        else params.ibrColumns = newColumns!;
        break;

      case "/lccHVDCLink":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "LCC-HVDC Link",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          message: `${
            operationType === "Hide-One"
              ? `Column <span style="font-weight: 610">${params.lccHVDCLinkColumns[columnIndex].title}</span> was removed`
              : operationType === "Hide-Many"
              ? `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.lccHVDCLinkColumns.find((changedColumn) => changedColumn.title == item.title)?.isHidden !==
                      item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title},</span>`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")} was/were removed`
              : `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.lccHVDCLinkColumns.find((changedColumn) => changedColumn.title == item.title)?.isHidden !==
                      item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title}</span> was ${
                        item.isHidden
                          ? `<span style="font-weight: 610">Removed, </span>`
                          : `<span style="font-weight: 610">Restored, </span>`
                      }`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")}`
          } from <span style="font-weight: 610">LCC-HVDC Link</span> table.`,
          document: {
            documentBeforeChange:
              operationType === "Hide-One" ? params.lccHVDCLinkColumns[columnIndex] : params.lccHVDCLinkColumns,
            documentAfterChange: operationType === "Hide-One" ? null : newColumns,
          },
        };
        if (operationType === "Hide-One") params.lccHVDCLinkColumns[columnIndex].isHidden = true;
        else params.lccHVDCLinkColumns = newColumns!;
        break;

      case "/seriesFact":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Series Fact",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          message: `${
            operationType === "Hide-One"
              ? `Column <span style="font-weight: 610">${params.seriesFactsColumns[columnIndex].title}</span> was removed`
              : operationType === "Hide-Many"
              ? `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.seriesFactsColumns.find((changedColumn) => changedColumn.title == item.title)?.isHidden !==
                      item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title},</span>`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")} was/were removed`
              : `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.seriesFactsColumns.find((changedColumn) => changedColumn.title == item.title)?.isHidden !==
                      item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title}</span> was ${
                        item.isHidden
                          ? `<span style="font-weight: 610">Removed, </span>`
                          : `<span style="font-weight: 610">Restored, </span>`
                      }`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")}`
          } from <span style="font-weight: 610">Series Fact</span> table.`,
          document: {
            documentBeforeChange:
              operationType === "Hide-One" ? params.seriesFactsColumns[columnIndex] : params.seriesFactsColumns,
            documentAfterChange: operationType === "Hide-One" ? null : newColumns,
          },
        };
        if (operationType === "Hide-One") params.seriesFactsColumns[columnIndex].isHidden = true;
        else params.seriesFactsColumns = newColumns!;
        break;

      case "/shuntFact":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Shunt Fact",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          message: `${
            operationType === "Hide-One"
              ? `Column <span style="font-weight: 610">${params.shuntFactsColumns[columnIndex].title}</span> was removed`
              : operationType === "Hide-Many"
              ? `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.shuntFactsColumns.find((changedColumn) => changedColumn.title == item.title)?.isHidden !==
                      item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title},</span>`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")} was/were removed`
              : `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.shuntFactsColumns.find((changedColumn) => changedColumn.title == item.title)?.isHidden !==
                      item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title}</span> was ${
                        item.isHidden
                          ? `<span style="font-weight: 610">Removed, </span>`
                          : `<span style="font-weight: 610">Restored, </span>`
                      }`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")}`
          } from <span style="font-weight: 610">Shunt Fact</span> table.`,
          document: {
            documentBeforeChange:
              operationType === "Hide-One" ? params.shuntFactsColumns[columnIndex] : params.shuntFactsColumns,
            documentAfterChange: operationType === "Hide-One" ? null : newColumns,
          },
        };
        if (operationType === "Hide-One") params.shuntFactsColumns[columnIndex].isHidden = true;
        else params.shuntFactsColumns = newColumns!;
        break;

      case "/vscHVDCLink":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "VSC-HVDC Link",
          operationType: operationType === "Update-Many" ? "Update" : "Delete",
          date: new Date(),
          message: `${
            operationType === "Hide-One"
              ? `Column <span style="font-weight: 610">${params.vscHVDCLinkColumns[columnIndex].title}</span> was removed`
              : operationType === "Hide-Many"
              ? `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.vscHVDCLinkColumns.find((changedColumn) => changedColumn.title == item.title)?.isHidden !==
                      item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title},</span>`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")} was/were removed`
              : `Column(s) ${newColumns
                  ?.map((item) => {
                    if (
                      params.vscHVDCLinkColumns.find((changedColumn) => changedColumn.title == item.title)?.isHidden !==
                      item.isHidden
                    ) {
                      return `<span style="font-weight: 610"> ${item.title}</span> was ${
                        item.isHidden
                          ? `<span style="font-weight: 610">Removed, </span>`
                          : `<span style="font-weight: 610">Restored, </span>`
                      }`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(" ")}`
          } from <span style="font-weight: 610">VSC-HVDC Link</span> table.`,
          document: {
            documentBeforeChange:
              operationType === "Hide-One" ? params.vscHVDCLinkColumns[columnIndex] : params.vscHVDCLinkColumns,
            documentAfterChange: operationType === "Hide-One" ? null : newColumns,
          },
        };
        if (operationType === "Hide-One") params.vscHVDCLinkColumns[columnIndex].isHidden = true;
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

export const deleteDefaultParam = async (indexToRemove: number, itemColumnName: string, userId: string) => {
  try {
    await connectToDatabase();
    const oldParams: IDefaultParamSchema[] = await DefaultParam.find();
    const params = oldParams[0];
    let modificationHistory;
    switch (itemColumnName) {
      case "/bus":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Bus",
          operationType: "Delete",
          date: new Date(),
          message: `Column <span style="font-weight: 610">${params.busColumns[indexToRemove].title}</span> was deleted permanently from <span style="font-weight: 610">Bus</span>.`,
          document: {
            columnDetails: params.busColumns[indexToRemove],
          },
        };
        params.busColumns.splice(indexToRemove, 1);
        break;

      case "/excitationSystem":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Excitation system",
          operationType: "Delete",
          date: new Date(),
          message: `Column <span style="font-weight: 610">${params.excitationSystemColumns[indexToRemove].title}</span> was deleted permanently from <span style="font-weight: 610">Excitation system</span>.`,
          document: {
            columnDetails: params.excitationSystemColumns[indexToRemove],
          },
        };
        params.excitationSystemColumns.splice(indexToRemove, 1);
        break;

      case "/generator":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Generator",
          operationType: "Delete",
          date: new Date(),
          message: `Column <span style="font-weight: 610">${params.generatorColumns[indexToRemove].title}</span> was deleted permanently from <span style="font-weight: 610">Generator</span>.`,
          document: {
            columnDetails: params.generatorColumns[indexToRemove],
          },
        };
        params.generatorColumns.splice(indexToRemove, 1);
        break;

      case "/load":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Load",
          operationType: "Delete",
          date: new Date(),
          message: `Column <span style="font-weight: 610">${params.loadsColumns[indexToRemove].title}</span> was deleted permanently from <span style="font-weight: 610">Load</span>.`,
          document: {
            columnDetails: params.loadsColumns[indexToRemove],
          },
        };
        params.loadsColumns.splice(indexToRemove, 1);
        break;

      case "/seriesCapacitor":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Series Capacitor",
          operationType: "Delete",
          date: new Date(),
          message: `Column <span style="font-weight: 610">${params.seriesCapacitorColumns[indexToRemove].title}</span> was deleted permanently from <span style="font-weight: 610">Series Capacitor</span>.`,
          document: {
            columnDetails: params.seriesCapacitorColumns[indexToRemove],
          },
        };
        params.seriesCapacitorColumns.splice(indexToRemove, 1);
        break;

      case "/shuntCapacitor":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Shunt Capacitor",
          operationType: "Delete",
          date: new Date(),
          message: `Column <span style="font-weight: 610">${params.shuntCapacitorColumns[indexToRemove].title}</span> was deleted permanently from <span style="font-weight: 610">Shunt Capacitor</span>.`,
          document: {
            columnDetails: params.shuntCapacitorColumns[indexToRemove],
          },
        };
        params.shuntCapacitorColumns.splice(indexToRemove, 1);
        break;

      case "/shuntReactor":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Shunt Reactor",
          operationType: "Delete",
          date: new Date(),
          message: `Column <span style="font-weight: 610">${params.shuntReactorsColumns[indexToRemove].title}</span> was deleted permanently from <span style="font-weight: 610">Shunt Reactor</span>.`,
          document: {
            columnDetails: params.shuntReactorsColumns[indexToRemove],
          },
        };
        params.shuntReactorsColumns.splice(indexToRemove, 1);
        break;

      case "/singleLineDiagram":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Single Line Diagram",
          operationType: "Delete",
          date: new Date(),
          message: `Column <span style="font-weight: 610">${params.singleLineDiagramsColumns[indexToRemove].title}</span> was deleted permanently from <span style="font-weight: 610">Single Line Diagram</span>.`,
          document: {
            columnDetails: params.singleLineDiagramsColumns[indexToRemove],
          },
        };
        params.singleLineDiagramsColumns.splice(indexToRemove, 1);
        break;

      case "/transformersThreeWinding":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Transformers Three Winding",
          operationType: "Delete",
          date: new Date(),
          message: `Column <span style="font-weight: 610">${params.transformersThreeWindingColumns[indexToRemove].title}</span> was deleted permanently from <span style="font-weight: 610">Transformers Three Winding</span>.`,
          document: {
            columnDetails: params.transformersThreeWindingColumns[indexToRemove],
          },
        };
        params.transformersThreeWindingColumns.splice(indexToRemove, 1);
        break;

      case "/transformersTwoWinding":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Transformers Two Winding",
          operationType: "Delete",
          date: new Date(),
          message: `Column <span style="font-weight: 610">${params.transformersTwoWindingColumns[indexToRemove].title}</span> was deleted permanently from <span style="font-weight: 610">Transformers Two Winding</span>.`,
          document: {
            columnDetails: params.transformersTwoWindingColumns[indexToRemove],
          },
        };
        params.transformersTwoWindingColumns.splice(indexToRemove, 1);
        break;

      case "/transmissionLine":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Transmission Line",
          operationType: "Delete",
          date: new Date(),
          message: `Column <span style="font-weight: 610">${params.transmissionLinesColumns[indexToRemove].title}</span> was deleted permanently from <span style="font-weight: 610">Transmission Line</span>.`,
          document: {
            columnDetails: params.transmissionLinesColumns[indexToRemove],
          },
        };
        params.transmissionLinesColumns.splice(indexToRemove, 1);
        break;

      case "/turbineGovernor":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Turbine Governor",
          operationType: "Delete",
          date: new Date(),
          message: `Column <span style="font-weight: 610">${params.turbineGovernorColumns[indexToRemove].title}</span> was deleted permanently from <span style="font-weight: 610">Turbine Governor</span>.`,
          document: {
            columnDetails: params.turbineGovernorColumns[indexToRemove],
          },
        };
        params.turbineGovernorColumns.splice(indexToRemove, 1);
        break;

      case "/ibr":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "IBR",
          operationType: "Delete",
          date: new Date(),
          message: `Column <span style="font-weight: 610">${params.ibrColumns[indexToRemove].title}</span> was deleted permanently from <span style="font-weight: 610">IBR</span>.`,
          document: {
            columnDetails: params.ibrColumns[indexToRemove],
          },
        };
        params.ibrColumns.splice(indexToRemove, 1);
        break;

      case "/lccHVDCLink":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "LCC-HVDC Link",
          operationType: "Delete",
          date: new Date(),
          message: `Column <span style="font-weight: 610">${params.lccHVDCLinkColumns[indexToRemove].title}</span> was deleted permanently from <span style="font-weight: 610">LCC-HVDC Link</span>.`,
          document: {
            columnDetails: params.lccHVDCLinkColumns[indexToRemove],
          },
        };
        params.lccHVDCLinkColumns.splice(indexToRemove, 1);
        break;

      case "/seriesFact":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Series Fact",
          operationType: "Delete",
          date: new Date(),
          message: `Column <span style="font-weight: 610">${params.seriesFactsColumns[indexToRemove].title}</span> was deleted permanently from <span style="font-weight: 610">Series Fact</span>.`,
          document: {
            columnDetails: params.seriesFactsColumns[indexToRemove],
          },
        };
        params.seriesFactsColumns.splice(indexToRemove, 1);
        break;

      case "/shuntFact":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "Shunt Fact",
          operationType: "Delete",
          date: new Date(),
          message: `Column <span style="font-weight: 610">${params.shuntFactsColumns[indexToRemove].title}</span> was deleted permanently from <span style="font-weight: 610">Shunt Fact</span>.`,
          document: {
            columnDetails: params.shuntFactsColumns[indexToRemove],
          },
        };
        params.shuntFactsColumns.splice(indexToRemove, 1);
        break;

      case "/vscHVDCLink":
        modificationHistory = {
          userId: new ObjectId(userId),
          databaseName: "VSC-HVDC Link",
          operationType: "Delete",
          date: new Date(),
          message: `Column <span style="font-weight: 610">${params.vscHVDCLinkColumns[indexToRemove].title}</span> was deleted permanently from <span style="font-weight: 610">VSC-HVDC Link</span>.`,
          document: {
            columnDetails: params.vscHVDCLinkColumns[indexToRemove],
          },
        };
        params.vscHVDCLinkColumns.splice(indexToRemove, 1);
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
