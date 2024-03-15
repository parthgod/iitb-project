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

interface TableProps {
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
    | "LCC-HVDC Link"
    | "VSC-HVDC Link"
    | "Series Fact"
    | "Shunt Fact";
  totalPages: number;
  totalDocuments: number;
  session: Session;
}

const DisplayTable = ({ columns, data, type, totalPages, totalDocuments, completeData, session }: TableProps) => {
  // return console.log(data);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const tableRef = useRef<HTMLTableElement>(null);

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
    idCellHeading.rowSpan = 2;

    const subHeadingRow = tempInput.insertRow();
    subHeadingRow.style.fontWeight = "bold";

    columns.forEach((headerText) => {
      const cell = headingRow.insertCell();
      cell.textContent = headerText.title;
      cell.style.border = "1px solid #000";
      cell.style.padding = "5px";
      if (headerText.type === "subColumns") {
        cell.colSpan = headerText.subColumns!.length;
        headerText.subColumns?.forEach((subItem) => {
          const subCell = subHeadingRow.insertCell();
          subCell.textContent = subItem.title;
          subCell.style.border = "1px solid #000";
          subCell.style.padding = "5px";
        });
      } else {
        cell.rowSpan = 2;
      }
    });

    completeData.forEach((rowData) => {
      const row = tempInput.insertRow();
      const idCell = row.insertCell();
      idCell.textContent = rowData.id;
      idCell.style.border = "1px solid #000";
      idCell.style.padding = "5px";
      columns.forEach((cellData) => {
        if (cellData.type === "subColumns") {
          cellData.subColumns?.map((subItem) => {
            const subCell = row.insertCell();
            subCell.style.border = "1px solid #000";
            subCell.style.padding = "5px";
            subCell.textContent =
              rowData?.[cellData.field]?.[subItem.field] ||
              rowData?.additionalFields?.[cellData.field]?.[subItem.field] ||
              "null";
          });
        } else {
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
      console.error("Error generating PDF:", error);
    }
  };

  const fnExportToExcel = (fn: string) => {
    const tempInput = document.createElement("table");
    const headingRow = tempInput.insertRow();
    const subHeadingRow = tempInput.insertRow();
    const idCellHeading = headingRow.insertCell();
    idCellHeading.textContent = "ID";
    idCellHeading.rowSpan = 2;
    columns.forEach((headerText) => {
      const cell = headingRow.insertCell();
      cell.textContent = headerText.title;
      if (headerText.type === "subColumns") {
        cell.colSpan = headerText.subColumns!.length;
        headerText.subColumns?.forEach((subItem) => {
          const subCell = subHeadingRow.insertCell();
          subCell.textContent = subItem.title;
        });
      } else {
        cell.rowSpan = 2;
      }
    });

    completeData.forEach((rowData) => {
      const row = tempInput.insertRow();
      const idCell = row.insertCell();
      idCell.textContent = rowData.id;
      columns.forEach((cellData) => {
        if (cellData.type === "subColumns") {
          cellData.subColumns?.map((subItem) => {
            const subCell = row.insertCell();
            subCell.textContent =
              rowData?.[cellData.field]?.[subItem.field] ||
              rowData.additionalFields?.[cellData.field]?.[subItem.field] ||
              "null";
          });
        } else {
          const cell = row.insertCell();
          cell.textContent = rowData?.[cellData.field] || rowData?.additionalFields?.[cellData.field] || "null";
        }
      });
    });

    var wb = XLSX.utils.table_to_book(tempInput, { sheet: "sheet1" });
    XLSX.writeFile(wb, fn + "." + "xlsx");
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        />
        <Table
          ref={tableRef}
          id="tbl_exporttable_to_xls"
        >
          <TableCaption className={`w-full ${!data.length && "pb-3"}`}>
            {data.length ? "" : `No ${type.toLowerCase()} found`}
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-slate-100">
              <TableHead
                rowSpan={2}
                className="border-[1px] border-gray-300 group max-w-10"
              >
                ID
              </TableHead>
              {columns.map((item, ind: number) =>
                item.type === "subColumns" ? (
                  <TableHead
                    key={ind}
                    colSpan={item.subColumns!.length}
                    className="border-[1px] border-gray-300 whitespace-nowrap text-center group"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {item.title}
                      <AddColumns
                        key={ind}
                        columnDetails={item}
                        userId={session?.user.id!}
                      />
                    </div>
                  </TableHead>
                ) : (
                  <TableHead
                    key={ind}
                    rowSpan={2}
                    className={`border-[1px] border-gray-300 group`}
                  >
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      {item.title}
                      {item.type === "dropdown" && (
                        <AddColumns
                          key={ind}
                          columnDetails={item}
                          userId={session?.user.id!}
                        />
                      )}
                    </div>
                  </TableHead>
                )
              )}
              {session?.user.isAdmin && (
                <TableHead
                  className="border-[1px] border-gray-300"
                  rowSpan={2}
                >
                  Actions
                </TableHead>
              )}
            </TableRow>
            <TableRow>
              {columns.map(
                (item, i: number) =>
                  item.type === "subColumns" &&
                  item.subColumns!.map((subCol, ind: number) => (
                    <TableHead
                      key={ind}
                      className="bg-muted border-[1px] border-gray-300"
                    >
                      <div className="flex items-center gap-2 whitespace-nowrap">{subCol.title}</div>
                    </TableHead>
                  ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, ind: number) => {
              return (
                <TableRow key={ind}>
                  <TableCell className="border-[1px] border-gray-300">{item.id}</TableCell>
                  {columns.map((column, i: number) => {
                    if (column.type === "subColumns")
                      return column.subColumns!.map((subItem, i: number) => (
                        <TableCell
                          key={i + 100}
                          className={`border-[1px] border-gray-300 ${
                            !item?.[column.field]?.[subItem.field] &&
                            !item?.additionalFields?.[column.field]?.[subItem.field] &&
                            "text-gray-400"
                          }`}
                        >
                          {subItem.type === "image" ? (
                            <Image
                              src={
                                item?.[column.field]?.[subItem.field] ||
                                item?.additionalFields?.[column.field]?.[subItem.field] ||
                                noImageUrl
                              }
                              alt="image"
                              width={120}
                              height={120}
                              className="object-cover"
                            />
                          ) : (
                            item?.[column.field]?.[subItem.field] ||
                            item?.additionalFields?.[column.field]?.[subItem.field] ||
                            "null"
                          )}
                        </TableCell>
                      ));
                    return (
                      <TableCell
                        key={i}
                        className={`border-[1px] border-gray-300 ${
                          !item?.[column.field] && !item?.additionalFields?.[column.field] && "text-gray-400"
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
                        ) : (
                          item?.[column.field] || item?.additionalFields?.[column.field] || "null"
                        )}
                      </TableCell>
                    );
                  })}
                  {session?.user.isAdmin ? (
                    <TableCell className="border-[1px] border-gray-300">
                      <div className="flex justify-start items-center gap-2.5">
                        <Link href={`/${convertField(type)}/${item._id}`}>
                          <div
                            title="Edit"
                            className="text-gray-500 rounded-full hover:bg-gray-200 p-1.5"
                          >
                            <MdEdit className="text-base" />
                          </div>
                        </Link>
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
  );
};

export default DisplayTable;
