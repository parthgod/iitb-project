import FilteredHistory from "@/components/FilteredHistory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllModificationsHistory } from "@/lib/actions/modificationHistory.actions";
import { convertDate, reverseUnslug } from "@/utils/helperFunctions";
import { IColumn, IDefaultParamSchema, IModificationHistory } from "@/utils/defaultTypes";
import { pfp } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const PrintModification = ({
  modificationHistory,
  defaultParams,
}: {
  modificationHistory: IModificationHistory[];
  defaultParams: IDefaultParamSchema[];
}) => {
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
      | "IBR"
      | "LCC-HVDC Link"
      | "VSC-HVDC Link"
      | "Series Fact"
      | "Shunt Fact"
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

      case "IBR":
        return defaultParams[0].ibrColumns;

      case "LCC-HVDC Link":
        return defaultParams[0].lccHVDCLinkColumns;

      case "Series Fact":
        return defaultParams[0].seriesFactsColumns;

      case "Shunt Fact":
        return defaultParams[0].shuntFactsColumns;

      case "VSC-HVDC Link":
        return defaultParams[0].vscHVDCLinkColumns;

      default:
        break;
    }
  };

  return modificationHistory.map((item, i: number) => (
    <Card
      className="w-full flex py-4 p-5"
      key={i}
    >
      <Avatar className="scale-100 mr-4">
        <AvatarImage src={item?.userId?.image || pfp} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="w-full">
        <CardHeader className="p-0 pb-4">
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
        <CardContent className="p-0">
          <p className="text-sm">
            {item.operationType === "Create" ? (
              item.document.columnDetails ? (
                <>
                  New column named <span className="font-semibold">{item.document.columnDetails.title}</span> of type{" "}
                  <span className="font-semibold">{reverseUnslug(item.document.columnDetails.type)}</span>
                  {item.document.columnDetails.type === "dropdown" ? (
                    item.document.columnDetails.tableRef ? (
                      <>
                        linked to{" "}
                        <span className="font-semibold">
                          {
                            getRequiredParams(item.document.documentAfterChange.tableRef)?.find(
                              (column) => column.field === item.document.documentAfterChange.columnRef
                            )?.title
                          }
                        </span>{" "}
                        of <span className="font-semibold">{item.document.columnDetails.tableRef}</span> table
                      </>
                    ) : (
                      <>
                        having dropdown values:
                        <span className="font-semibold">
                          {item.document.columnDetails.dropdownValues &&
                            item.document.columnDetails.dropdownValues.map(
                              (dropdownValue: string) => `'${dropdownValue}'`
                            )}
                        </span>
                      </>
                    )
                  ) : (
                    ""
                  )}{" "}
                  was added to <span className="font-semibold">{item.databaseName}</span>.
                </>
              ) : item.document.documentAfterChange ? (
                <>
                  <span className="font-semibold">{item.document.documentAfterChange}</span> records were added to{" "}
                  <span className="font-semibold">{item.databaseName}</span> from an excel file
                </>
              ) : (
                <>
                  New record with ID <span className="font-semibold">{item.document.id}</span> was added to{" "}
                  <span className="font-semibold">{item.databaseName}</span>.
                </>
              )
            ) : item.operationType === "Update" ? (
              item.document.documentBeforeChange ? (
                item.document.documentAfterChange ? (
                  <>
                    Column{" "}
                    {item.document.documentAfterChange.map((subItem: IColumn) => {
                      if (
                        item.document.documentBeforeChange.find(
                          (changedColumn: IColumn) => changedColumn.title == subItem.title
                        ).isRemoved !== subItem.isRemoved
                      ) {
                        return (
                          <>
                            <span className="font-semibold">{subItem.title}</span> was{" "}
                            {subItem.isRemoved ? (
                              <span className="font-semibold">Removed</span>
                            ) : (
                              <span className="font-semibold">Restored</span>
                            )}
                            ,{" "}
                          </>
                        );
                      }
                    })}{" "}
                    in <span className="font-semibold">{item.databaseName}</span> table.
                  </>
                ) : (
                  <>
                    Column <span className="font-semibold">{item.document.documentBeforeChange.title}</span> was updated
                    for <span className="font-semibold">{item.databaseName}</span> table.{" "}
                    {item.document.documentBeforeChange.title !== item.document.documentAfterChange.title ? (
                      <>
                        It&apos;s new name is{" "}
                        <span className="font-semibold">{item.document.documentAfterChange.title}</span> and is
                      </>
                    ) : (
                      <>It is now</>
                    )}{" "}
                    of type{" "}
                    <span className="font-semibold">{reverseUnslug(item.document.documentAfterChange.type)}</span>
                    {item.document.documentAfterChange.type === "dropdown" ? (
                      item.document.documentAfterChange.tableRef ? (
                        <>
                          {" "}
                          linked to{" "}
                          <span className="font-semibold">
                            {
                              getRequiredParams(item.document.documentAfterChange.tableRef)?.find(
                                (column) => column.field === item.document.documentAfterChange.columnRef
                              )?.title
                            }
                          </span>{" "}
                          of <span className="font-semibold">{item.document.documentAfterChange.tableRef}</span> table
                        </>
                      ) : (
                        <>
                          {" "}
                          having dropdown values:{" "}
                          <span className="font-semibold">
                            {item.document.documentAfterChange.dropdownValues &&
                              item.document.documentAfterChange.dropdownValues.map(
                                (dropdownValue: string) => `'${dropdownValue}'`
                              )}
                          </span>
                        </>
                      )
                    ) : (
                      ""
                    )}
                    .
                  </>
                )
              ) : (
                <>
                  Record with ID <span className="font-semibold">{item.document.id}</span> was updated. Field
                  {getRequiredParams(item.databaseName)!
                    .map((key, ind: number) => {
                      if (
                        item.document.documentBeforeChange.hasOwnProperty(key.field) &&
                        item.document.documentAfterChange.hasOwnProperty(key.field)
                      ) {
                        if (
                          item.document.documentBeforeChange[key.field] !== item.document.documentAfterChange[key.field]
                        ) {
                          if (key.type === "image")
                            return (
                              <>
                                {" "}
                                <span className="font-semibold">{key.title}</span> was changed
                              </>
                            );
                          return (
                            <>
                              {" "}
                              <span className="font-semibold">{key.title}</span> was changed from{" "}
                              <span className="font-semibold">{item.document.documentBeforeChange[key.field]}</span> to{" "}
                              <span className="font-semibold">{item.document.documentAfterChange[key.field]}</span>
                              {ind === getRequiredParams(item.databaseName)!.length - 1 ? "." : ","}
                            </>
                          );
                        }
                      } else if (
                        item.document.documentBeforeChange?.additionalFields?.hasOwnProperty(key.field) &&
                        item.document.documentAfterChange?.additionalFields?.hasOwnProperty(key.field)
                      ) {
                        if (
                          item.document.documentBeforeChange.additionalFields[key.field] !==
                          item.document.documentAfterChange.additionalFields[key.field]
                        ) {
                          if (key.type === "image")
                            return (
                              <>
                                {" "}
                                <span className="font-semibold">{key.title}</span> was changed
                              </>
                            );
                          return (
                            <>
                              {" "}
                              <span className="font-semibold">{key.title}</span> was changed from{" "}
                              <span className="font-semibold">
                                {item.document.documentBeforeChange.additionalFields[key.field]}
                              </span>{" "}
                              to{" "}
                              <span className="font-semibold">
                                {item.document.documentAfterChange.additionalFields[key.field]}
                              </span>
                              {ind === getRequiredParams(item.databaseName)!.length - 1 ? "." : ","}
                            </>
                          );
                        }
                      } else {
                        return (
                          <>
                            <span className="font-semibold">{key.title}</span> was updated to{" "}
                            <span className="font-semibold">
                              {item.document.documentAfterChange[key.field] ||
                                item.document.documentAfterChange.additionalFields[key.field]}
                            </span>
                          </>
                        );
                      }
                      return null;
                    })
                    .filter(Boolean)
                    .join(" ")}
                  .
                </>
              )
            ) : item.document.id ? (
              <>
                Record with ID <span className="font-semibold">{item.document.id}</span> was deleted from{" "}
                <span className="font-semibold">{item.databaseName}</span>.
              </>
            ) : item.document.documentAfterChange ? (
              <>
                Column{" "}
                {item.document.documentAfterChange.map((subItem: IColumn) => {
                  if (
                    item.document.documentBeforeChange.find(
                      (changedColumn: IColumn) => changedColumn.title == subItem.title
                    ).isRemoved !== subItem.isRemoved
                  ) {
                    return (
                      <span
                        key={subItem.field}
                        className="font-semibold"
                      >
                        {subItem.title},{" "}
                      </span>
                    );
                  }
                })}{" "}
                was <span className="font-semibold">Removed</span> in{" "}
                <span className="font-semibold">{item.databaseName}</span> table.
              </>
            ) : (
              <>
                Column <span className="font-semibold">{item.document.documentBeforeChange.title}</span> was{" "}
                <span className="font-semibold">Removed</span> from{" "}
                <span className="font-semibold">{item.databaseName}</span> table.
              </>
            )}
          </p>
        </CardContent>
      </div>
    </Card>
  ));
};

const HistoryPage = async ({
  searchParams,
}: {
  searchParams: { type: string; databaseName: string; query: string };
}) => {
  const type = searchParams.type || "";
  const databaseName = searchParams.databaseName || "";
  const query = searchParams.query || "";
  const { data: modificationHistory, totalDocuments } = await getAllModificationsHistory({
    type: type,
    databaseName: databaseName,
    query: query,
  });
  const { data: defaultParams } = await getDefaultParams();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold p-3">Edit history</h1>
      {modificationHistory.length ? (
        <>
          <FilteredHistory />
          <div className="flex flex-col gap-4 h-[77vh] overflow-auto custom-scrollbar px-3 pr-4">
            <PrintModification
              modificationHistory={modificationHistory}
              defaultParams={defaultParams}
            />
          </div>
        </>
      ) : (
        <p className="w-full text-center">No results found</p>
      )}
    </div>
  );
};

export default HistoryPage;
