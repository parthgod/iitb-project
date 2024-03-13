import FilteredHistory from "@/components/FilteredHistory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllModificationsHistory } from "@/lib/actions/modificationHistory.actions";
import { convertDate, reverseUnslug } from "@/utils/helperFunctions";

const HistoryPage = async ({
  searchParams,
}: {
  searchParams: { type: string; databaseName: string; query: string };
}) => {
  const type = searchParams.type || "";
  const databaseName = searchParams.databaseName || "";
  const query = searchParams.query || "";
  const {
    data: modificationHistory,
    totalDocuments,
    conditions,
  } = await getAllModificationsHistory({
    type: type,
    databaseName: databaseName,
    query: query,
  });
  const { data: defaultParams } = await getDefaultParams();

  const getRequiredParams = (
    databaseName:
      | "Bus"
      | "Excitation System"
      | "Generator"
      | "Load"
      | "Series Capacitor"
      | "Shunt Capacitor"
      | "Shunt Reactor"
      | "Single Line Diagram"
      | "Transformers Three Winding"
      | "Transformers Two Winding"
      | "Transmission Line"
      | "Turbine Governor"
  ) => {
    switch (databaseName) {
      case "Bus":
        return defaultParams[0].busColumns;
      case "Excitation System":
        return defaultParams[0].excitationSystemColumns;
      case "Generator":
        return defaultParams[0].generatorColumns;
      case "Load":
        return defaultParams[0].loadsColumns;
      case "Series Capacitor":
        return defaultParams[0].seriesCapacitorColumns;
      case "Shunt Capacitor":
        return defaultParams[0].shuntCapacitorColumns;
      case "Shunt Reactor":
        return defaultParams[0].shuntReactorsColumns;
      case "Single Line Diagram":
        return defaultParams[0].singleLineDiagramsColumns;
      case "Transformers Three Winding":
        return defaultParams[0].transformersThreeWindingColumns;
      case "Transformers Two Winding":
        return defaultParams[0].transformersTwoWindingColumns;
      case "Transmission Line":
        return defaultParams[0].transmissionLinesColumns;
      case "Turbine Governor":
        return defaultParams[0].turbineGovernorColumns;

      default:
        break;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold p-3 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">Edit history</h1>
      <FilteredHistory conditions={conditions} />
      <div className="flex flex-col gap-4 h-[80vh] overflow-auto px-3">
        {modificationHistory.length ? (
          modificationHistory.map((item, i: number) => (
            <Card
              className="w-[98%]"
              key={i}
            >
              <CardHeader>
                <div className="flex w-full justify-between items-center">
                  <CardTitle className="text-lg">
                    Changes made by {item?.userId?.name} in {item.databaseName}
                  </CardTitle>
                  <CardTitle className="text-md font-semibold text-gray-500">{convertDate(item?.date)}</CardTitle>
                </div>
                <div className="flex gap-3">
                  <CardDescription className="text-sm">{item?.userId?.email}</CardDescription>
                  <CardDescription className="text-sm">|</CardDescription>
                  <CardDescription className="text-sm">{item?.operationType}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {item.operationType === "Create"
                    ? item.document.columnDetails
                      ? `New column named '${item.document.columnDetails.title}' of type ${reverseUnslug(
                          item.document.columnDetails.type
                        )} ${
                          item.document.columnDetails.type === "subColumns"
                            ? ` having subcolumns ${item.document.columnDetails.subColumns
                                .map(
                                  (subitem: any) =>
                                    `'${subitem.title}' of type ${reverseUnslug(subitem.type)}${
                                      subitem.type === "dropdown"
                                        ? ` having dropdown values as ${subitem.dropdownValues.map(
                                            (dropItem: string) => `'${dropItem}' `
                                          )}`
                                        : ""
                                    }, `
                                )
                                .filter(Boolean)
                                .join(" ")} was added`
                            : `${
                                item.document.columnDetails.type === "dropdown" &&
                                `having dropdown values as ${item.document.columnDetails.dropdownValues
                                  .map((dropItem: any) => `'${dropItem}' `)
                                  .filter(Boolean)
                                  .join(" ")}`
                              } was added`
                        }`
                      : `New record with ID ${item.document.id} was added to ${item.databaseName}.`
                    : item.operationType === "Update"
                    ? item.document.columnDetails
                      ? `Column '${item.document.columnDetails.title}' was updated for ${item.databaseName} table. `
                      : `Record with ID ${item.document.id} was updated. Field${getRequiredParams(item.databaseName)!
                          .map((key, ind: number) => {
                            if (
                              item.document.documentBeforeChange.hasOwnProperty(key.field) &&
                              item.document.documentAfterChange.hasOwnProperty(key.field)
                            ) {
                              if (key.type === "subColumns") {
                                `${key.title}'s ${key.subColumns!.map((subCol) => {
                                  if (
                                    item.document.documentBeforeChange[key.field][subCol.field] !==
                                    item.document.documentAfterChange[key.field][subCol.field]
                                  ) {
                                    return ` ${subCol.title} was changed from ${
                                      item.document.documentBeforeChange[key.field][subCol.field]
                                    } to ${item.document.documentAfterChange[key.field][subCol.field]}${
                                      ind === getRequiredParams(item.databaseName)!.length - 1 ? "." : ","
                                    }`;
                                  }
                                })}`;
                              } else {
                                if (
                                  item.document.documentBeforeChange[key.field] !==
                                  item.document.documentAfterChange[key.field]
                                ) {
                                  return ` ${key.title} was changed from ${
                                    item.document.documentBeforeChange[key.field]
                                  } to ${item.document.documentAfterChange[key.field]}${
                                    ind === getRequiredParams(item.databaseName)!.length - 1 ? "." : ","
                                  }`;
                                }
                              }
                            } else if (
                              item.document.documentBeforeChange?.additionalFields?.hasOwnProperty(key.field) &&
                              item.document.documentAfterChange?.additionalFields?.hasOwnProperty(key.field)
                            ) {
                              if (key.type === "subColumns") {
                                `${key.title}'s ${key.subColumns!.map((subCol) => {
                                  if (
                                    item.document.documentBeforeChange?.additionalFields[key.field][subCol.field] !==
                                    item.document.documentAfterChange?.additionalFields[key.field][subCol.field]
                                  ) {
                                    return ` ${subCol.title} was changed from ${
                                      item.document.documentBeforeChange?.additionalFields[key.field][subCol.field]
                                    } to ${
                                      item.document.documentAfterChange?.additionalFields[key.field][subCol.field]
                                    }${ind === getRequiredParams(item.databaseName)!.length - 1 ? "." : ","}`;
                                  }
                                })}`;
                              } else {
                                if (
                                  item.document.documentBeforeChange.additionalFields[key.field] !==
                                  item.document.documentAfterChange.additionalFields[key.field]
                                ) {
                                  return ` ${key.title} was changed from ${
                                    item.document.documentBeforeChange.additionalFields[key.field]
                                  } to ${item.document.documentAfterChange.additionalFields[key.field]}${
                                    ind === getRequiredParams(item.databaseName)!.length - 1 ? "." : ","
                                  }`;
                                }
                              }
                            } else if (key.type === "subColumns") {
                              return `, ${key.title}'s ${key.subColumns!.map((subCol) => {
                                return ` ${subCol.title} was updated to ${
                                  item.document.documentAfterChange.additionalFields[key.field][subCol.field]
                                }`;
                              })}`;
                            } else {
                              return `${key.title} was updated to ${
                                item.document.documentAfterChange[key.field] ||
                                item.document.documentAfterChange.additionalFields[key.field]
                              }`;
                            }
                            return null;
                          })
                          .filter(Boolean)
                          .join(" ")}`
                    : `Record with ID ${item.document.id} was deleted from ${item.databaseName}`}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="w-full text-center">No results found</p>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
