"use server";

import { connectToDatabase } from "../database/database";
import DefaultParam from "../database/models/defaultParams";
import { convertField, handleError } from "../../utils/helperFunctions";

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
  try {
    await connectToDatabase();
    let newColumns;
    const oldParams: any = await DefaultParam.find();
    if (columnDetails.hasSubcolumns === "true") {
      columnDetails.type = "subColumns";
      columnDetails.subcolumns.forEach((subItem: any) => {
        subItem.field = convertField(columnDetails.name + subItem.title);
        if (subItem.type === "dropdown") {
          subItem.dropdownValues = subItem.dropdownValues.map((dropdownValue: any) => dropdownValue.name);
        }
      });
      newColumns = {
        field: convertField(columnDetails.name),
        title: columnDetails.name,
        type: columnDetails.type,
        subColumns: columnDetails.subcolumns,
        isDefault: false,
      };
    } else {
      if (columnDetails.type === "dropdown") {
        const dropdownValues = columnDetails.dropdownValues.map((item: any) => item.name);
        newColumns = {
          field: convertField(columnDetails.name),
          title: columnDetails.name,
          type: columnDetails.type,
          dropdownValues: dropdownValues,
          isDefault: false,
        };
      } else {
        newColumns = {
          field: convertField(columnDetails.name),
          title: columnDetails.name,
          type: columnDetails.type,
          isDefault: false,
        };
      }
    }
    const newParams = oldParams[0];
    switch (itemColumnName) {
      case "/bus":
        newParams.busColumns.push(newColumns);
        break;

      case "/excitationSystem":
        newParams.excitationSystemColumns.push(newColumns);
        break;

      case "/generator":
        newParams.generatorColumns.push(newColumns);
        break;

      case "/load":
        newParams.loadsColumns.push(newColumns);
        break;

      case "/seriesCapacitor":
        newParams.seriesCapacitorColumns.push(newColumns);
        break;

      case "/shuntCapacitor":
        newParams.shuntCapacitorColumns.push(newColumns);
        break;

      case "/shuntReactor":
        newParams.shuntReactorsColumns.push(newColumns);
        break;

      case "/singleLineDiagram":
        newParams.singleLineDiagramsColumns.push(newColumns);
        break;

      case "/transformersThreeWinding":
        newParams.transformersThreeWindingColumns.push(newColumns);
        break;

      case "/transformersTwoWinding":
        newParams.transformersTwoWindingColumns.push(newColumns);
        break;

      case "/transmissionLine":
        newParams.transmissionLinesColumns.push(newColumns);
        break;

      case "/turbineGovernor":
        newParams.turbineGovernorColumns.push(newColumns);
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
    return { data: JSON.parse(JSON.stringify(newDefaultParams)), status: 200 };
  } catch (error) {
    handleError(error);
  }
};
