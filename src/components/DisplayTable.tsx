"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { noImageUrl } from "@/lib/constants";
import {
  IBus,
  IColumn,
  IExcitationSystem,
  IGenerator,
  ILoad,
  INonDefaultDatabases,
  ISeriesCapacitor,
  IShuntCapacitor,
  IShuntReactor,
  ISingleLineDiagram,
  ITransformersThreeWinding,
  ITransformersTwoWinding,
  ITransmissionLine,
  ITurbineGovernor,
} from "@/utils/defaultTypes";
import { convertField } from "@/utils/helperFunctions";
import jsPDF from "jspdf";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import * as XLSX from "xlsx/xlsx.mjs";
import AddColumns from "./AddColumns";
import DeleteConfirmation from "./DeleteConfirmation";
import TableHeading from "./TableHeading";
import TableSkeleton from "./TableSkeleton";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { toggleGeneratorSwitchValue } from "@/lib/actions/generator.actions";
import { toast } from "sonner";
import { toggleBusSwitchValue } from "@/lib/actions/bus.actions";
import { toggleExcitationSystemSwitchValue } from "@/lib/actions/excitationSystem.actions";
import { toggleIBRSwitchValue } from "@/lib/actions/ibr.actions";
import { toggleLCCHVDCLinkSwitchValue } from "@/lib/actions/lccHVDCLink.actions";
import { toggleLoadSwitchValue } from "@/lib/actions/load.actions";
import { toggleSeriesCapacitorSwitchValue } from "@/lib/actions/seriesCapacitor.actions";
import { toggleSeriesFactSwitchValue } from "@/lib/actions/seriesFact.actions";
import { toggleShuntCapacitorSwitchValue } from "@/lib/actions/shuntCapacitor.actions";
import { toggleShuntFactSwitchValue } from "@/lib/actions/shuntFact.actions";
import { toggleShuntReactorSwitchValue } from "@/lib/actions/shuntReactor.actions";
import { toggleSingleLineDiagramSwitchValue } from "@/lib/actions/singleLineDiagram.actions";
import { toggleTransformersThreeWindingSwitchValue } from "@/lib/actions/transformersThreeWinding.actions";
import { toggleTransformersTwoWindingSwitchValue } from "@/lib/actions/transformersTwoWinding.actions";
import { toggleTransmissionLineSwitchValue } from "@/lib/actions/transmissionLines.actions";
import { toggleTurbineGovernorSwitchValue } from "@/lib/actions/turbineGovernor.actions";
import { toggleVSCHVDCLinkSwitchValue } from "@/lib/actions/vscHVDCLink.actions";

type TableProps = {
  columns: IColumn[];
  data:
    | IBus[]
    | IExcitationSystem[]
    | IGenerator[]
    | ILoad[]
    | ISeriesCapacitor[]
    | IShuntCapacitor[]
    | IShuntReactor[]
    | ISingleLineDiagram[]
    | ITransformersThreeWinding[]
    | ITransformersTwoWinding[]
    | ITransmissionLine[]
    | ITurbineGovernor[];
  completeData:
    | IBus[]
    | IExcitationSystem[]
    | IGenerator[]
    | ILoad[]
    | ISeriesCapacitor[]
    | IShuntCapacitor[]
    | IShuntReactor[]
    | ISingleLineDiagram[]
    | ITransformersThreeWinding[]
    | ITransformersTwoWinding[]
    | ITransmissionLine[]
    | ITurbineGovernor[]
    | INonDefaultDatabases[];
  type:
    | "Excitation System"
    | "Bus"
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
    | "LCC - HVDC Link"
    | "VSC - HVDC Link"
    | "Series Fact"
    | "Shunt Fact";
  totalPages: number;
  totalDocuments: number;
  session: Session;
  page: number;
};

const DisplayTable = ({ columns, data, type, totalPages, totalDocuments, completeData, session, page }: TableProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [switchStatus, setSwitchStatus] = useState<any>({});

  const tableRef = useRef<HTMLTableElement>(null);

  const router = useRouter();

  function getBase64Image(img: any) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx!.drawImage(img, 0, 0);

    return canvas.toDataURL("image/png");
  }

  const downloadPDF = async (type: string) => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a0",
    });

    const tempInput = document.createElement("table");
    tempInput.style.borderCollapse = "collapse";
    tempInput.style.fontSize = "10px";
    tempInput.style.maxWidth = "2400px";

    const headingRow = tempInput.insertRow();
    headingRow.style.fontWeight = "bold";
    const idCellHeading = headingRow.insertCell();
    idCellHeading.textContent = "ID";
    idCellHeading.style.border = "1px solid #000";
    idCellHeading.style.padding = "5px";

    columns.forEach((headerText) => {
      if (!headerText.isHidden) {
        const cell = headingRow.insertCell();
        cell.textContent = headerText.title;
        cell.style.border = "1px solid #000";
        cell.style.padding = "5px";
      }
    });

    completeData.forEach((rowData) => {
      const row = tempInput.insertRow();
      const idCell = row.insertCell();
      idCell.textContent = rowData._id;
      idCell.style.border = "1px solid #000";
      idCell.style.padding = "5px";
      columns.forEach((cellData) => {
        if (!cellData.isHidden) {
          const cell = row.insertCell();
          cell.style.border = "1px solid #000";
          cell.style.padding = "5px";
          // if (cellData.type === "image") {
          //   cell.innerHTML = `<img src="${encodeURIComponent(rowData[cellData.field])}" width={50} height={50} />`;
          // } else {
          cell.textContent = rowData?.[cellData.field] || rowData.additionalFields?.[cellData.field] || "null";
          // }
        }
      });
    });

    try {
      await pdf.html(tempInput.outerHTML, {
        callback: () => {
          pdf.save(`${type}.pdf`);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fnExportToExcel = (fn: string) => {
    const tempInput = document.createElement("table");
    const headingRow = tempInput.insertRow();
    const idCellHeading = headingRow.insertCell();
    idCellHeading.textContent = "ID";
    columns.forEach((headerText) => {
      if (!headerText.isHidden) {
        const cell = headingRow.insertCell();
        cell.textContent = headerText.title;
      }
    });

    completeData.forEach((rowData) => {
      const row = tempInput.insertRow();
      const idCell = row.insertCell();
      idCell.textContent = rowData._id;
      columns.forEach((cellData) => {
        if (!cellData.isHidden) {
          const cell = row.insertCell();
          cell.textContent = rowData?.[cellData.field] || rowData?.additionalFields?.[cellData.field] || "null";
        }
      });
    });

    var wb = XLSX.utils.table_to_book(tempInput, { sheet: "sheet1" });
    XLSX.writeFile(wb, fn + "." + "xlsx");
  };

  const handleSwitchChange = async (id: string, value: boolean, column: IColumn) => {
    setSwitchStatus((prev: any) => ({ ...prev, [id]: { [column.field]: value } }));

    try {
      let response;
      switch (type) {
        case "Bus":
          response = await toggleBusSwitchValue(id, column, session.user.id, value ? "ON" : "OFF");
          break;

        case "Excitation System":
          response = await toggleExcitationSystemSwitchValue(id, column, session.user.id, value ? "ON" : "OFF");
          break;

        case "Generator":
          response = await toggleGeneratorSwitchValue(id, column, session.user.id, value ? "ON" : "OFF");
          break;

        case "IBR":
          response = await toggleIBRSwitchValue(id, column, session.user.id, value ? "ON" : "OFF");
          break;

        case "LCC - HVDC Link":
          response = await toggleLCCHVDCLinkSwitchValue(id, column, session.user.id, value ? "ON" : "OFF");
          break;

        case "Load":
          response = await toggleLoadSwitchValue(id, column, session.user.id, value ? "ON" : "OFF");
          break;

        case "Series Capacitor":
          response = await toggleSeriesCapacitorSwitchValue(id, column, session.user.id, value ? "ON" : "OFF");
          break;

        case "Series Fact":
          response = await toggleSeriesFactSwitchValue(id, column, session.user.id, value ? "ON" : "OFF");
          break;

        case "Shunt Capacitor":
          response = await toggleShuntCapacitorSwitchValue(id, column, session.user.id, value ? "ON" : "OFF");
          break;

        case "Shunt Fact":
          response = await toggleShuntFactSwitchValue(id, column, session.user.id, value ? "ON" : "OFF");
          break;

        case "Shunt Reactor":
          response = await toggleShuntReactorSwitchValue(id, column, session.user.id, value ? "ON" : "OFF");
          break;

        case "Single Line Diagram":
          response = await toggleSingleLineDiagramSwitchValue(id, column, session.user.id, value ? "ON" : "OFF");
          break;

        case "Transformers Three Winding":
          response = await toggleTransformersThreeWindingSwitchValue(id, column, session.user.id, value ? "ON" : "OFF");
          break;

        case "Transformers Two Winding":
          response = await toggleTransformersTwoWindingSwitchValue(id, column, session.user.id, value ? "ON" : "OFF");
          break;

        case "Transmission Line":
          response = await toggleTransmissionLineSwitchValue(id, column, session.user.id, value ? "ON" : "OFF");
          break;

        case "Turbine Governor":
          response = await toggleTurbineGovernorSwitchValue(id, column, session.user.id, value ? "ON" : "OFF");
          break;

        case "VSC - HVDC Link":
          response = await toggleVSCHVDCLinkSwitchValue(id, column, session.user.id, value ? "ON" : "OFF");
          break;

        default:
          break;
      }

      if (response?.status === 200) {
        toast.success(response.data);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (columns.length && data.length) {
      let switchValues: any;
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        for (let j = 0; j < columns.length; j++) {
          let column = columns[j];
          if (column.type === "switch") {
            if (column.isDefault) {
              switchValues = {
                ...switchValues,
                [item._id]: { [column.field]: item?.[column.field] === "ON" || false },
              };
            } else
              switchValues = {
                ...switchValues,
                [item._id]: { [column.field]: item?.additionalFields?.[column.field] === "ON" || false },
              };
          }
        }
      }
      setSwitchStatus(switchValues);
    }
  }, [columns, data]);

  if (!isMounted) return <TableSkeleton />;

  return (
    <div className="p-4 pb-2">
      <div className="shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] rounded-xl">
        <TableHeading
          totalPages={totalPages}
          totalDocuments={totalDocuments}
          type={type}
          downloadPDF={downloadPDF}
          fnExportToExcel={fnExportToExcel}
          columns={columns}
          session={session}
          page={page}
        />
        <div className="relative flex items-start justify-start w-full overflow-auto custom-scrollbar max-h-[67vh]">
          <Table
            ref={tableRef}
            id="tbl_exporttable_to_xls"
          >
            <TableCaption className={`w-full ${!data.length && "pb-3"}`}>
              {data.length ? "" : `No ${type} found`}
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-slate-100">
                <TableHead className="border-[1px] border-gray-300 group max-w-10">ID</TableHead>
                {columns.map((item, ind: number) =>
                  item.isHidden ? (
                    ""
                  ) : (
                    <TableHead
                      key={ind}
                      className={`border-[1px] border-gray-300 group`}
                    >
                      <div className="flex items-center gap-2 whitespace-nowrap justify-between">
                        {item.title}
                        {session.user.isAdmin && (
                          <Popover>
                            <PopoverTrigger
                              className="p-1 rounded-full hover:bg-gray-200"
                              id={`popover-btn-${ind}`}
                            >
                              <PiDotsThreeVerticalBold />
                            </PopoverTrigger>
                            <PopoverContent className="flex flex-col gap-2 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
                              <AddColumns
                                actionType="Add-Column-Left"
                                columnIndex={ind}
                                userId={session.user.id}
                              />
                              <AddColumns
                                actionType="Add-Column-Right"
                                columnIndex={ind}
                                userId={session.user.id}
                              />
                              <AddColumns
                                actionType="Edit-Column"
                                columnIndex={ind}
                                userId={session.user.id}
                                columnDetails={item}
                              />
                              <AddColumns
                                actionType="Hide-Column"
                                columnIndex={ind}
                                userId={session.user.id}
                                columnDetails={item}
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </TableHead>
                  )
                )}
                {session?.user.isAdmin && <TableHead className="border-[1px] border-gray-300">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, ind: number) => {
                return (
                  <TableRow key={ind}>
                    <TableCell className="border-[1px] border-gray-300">{item._id}</TableCell>
                    {columns.map((column, i: number) =>
                      column.isHidden ? (
                        ""
                      ) : (
                        <TableCell
                          key={i}
                          className={`border-[1px] border-gray-300 ${
                            !item?.[column.field] && !item?.additionalFields?.[column.field] && "text-gray-400 italic"
                          }`}
                        >
                          {column.type === "image" ? (
                            <Image
                              src={item?.[column.field] || item?.additionalFields?.[column.field] || noImageUrl}
                              alt="image"
                              width={120}
                              height={120}
                              className="object-cover"
                            />
                          ) : column.type === "switch" ? (
                            <label className="rocker rocker-small">
                              <input
                                type="checkbox"
                                checked={switchStatus?.[item._id]?.[column.field] || false}
                                onChange={(e) => handleSwitchChange(item._id, e.target.checked, column)}
                              />
                              <span className="switch-left">ON</span>
                              <span className="switch-right">OFF</span>
                            </label>
                          ) : (
                            item?.[column.field] || item?.additionalFields?.[column.field] || "null"
                          )}
                        </TableCell>
                      )
                    )}

                    {session?.user.isAdmin ? (
                      <TableCell className="border-[1px] border-gray-300">
                        <div className="flex justify-start items-center gap-2.5">
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger>
                                <Link href={`/${convertField(type)}/${item._id}`}>
                                  <div
                                    title="Edit"
                                    className="text-gray-500 rounded-full hover:bg-gray-200 p-1.5"
                                  >
                                    <MdEdit className="text-base" />
                                  </div>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                <p>Edit</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <DeleteConfirmation
                            id={item._id}
                            type={type}
                            userId={session.user.id}
                          />
                        </div>
                      </TableCell>
                    ) : (
                      ""
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DisplayTable;
