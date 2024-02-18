"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { noImageUrl } from "@/lib/constants";
import { IColumn } from "@/lib/database/models/defaultParams";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import * as XLSX from "xlsx/xlsx.mjs";
import DeleteConfirmation from "./DeleteConfirmation";
import { Button } from "./ui/button";

interface TableProps {
  columns: IColumn[];
  data: any;
  type: "Vendor" | "Warehouse" | "Product";
}

const DisplayTable = ({ columns, data, type }: TableProps) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const iconRef = useRef<HTMLInputElement>(null);

  const { data: session } = useSession();

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prevDirection) => (prevDirection === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a: any, b: any) => {
    if (!sortColumn) return 0;

    const valueA = a[sortColumn] || a.additionalFields?.[sortColumn];
    const valueB = b[sortColumn] || b.additionalFields?.[sortColumn];

    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  const toggleButtons = () => {
    if (iconRef.current) {
      const iconRect = iconRef.current.getBoundingClientRect();
      const buttons = document.getElementById("buttons");
      if (buttons) {
        buttons.style.top = `${iconRect.bottom}px`;
        buttons.style.left = `${iconRect.left - 100}px`;
        buttons.classList.toggle("invisible");
      }
    }
  };

  const downloadPDF = async (type: any) => {
    const input: any = tableRef.current;
    const tempInput: any = input.cloneNode(true);

    if (tempInput && tempInput.rows.length > 0) {
      const rowsArray = Array.from(tempInput.rows);

      rowsArray.forEach((row: any) => {
        const lastCell = row.lastChild;

        if (session?.user.isAdmin) {
          if (lastCell) {
            row.removeChild(lastCell);
          }
        }

        const sortIconsDivs = row.querySelectorAll("#sort_icons");
        sortIconsDivs.forEach((div: any) => {
          if (div.parentNode) {
            div.parentNode.removeChild(div);
          }
        });
      });
    }

    try {
      tempInput.id = "clonedTable";
      tempInput.style.position = "absolute";
      tempInput.style.left = "-9999px";
      tempInput.style.top = "-9999px";
      document.body.appendChild(tempInput);
      const canvas = await html2canvas(document.getElementById("clonedTable")!);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save(`${type}.pdf`);
      document.body.removeChild(tempInput);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  function fnExportToExcel(fn: any) {
    var elt: any = tableRef.current;
    const tempInput = elt.cloneNode(true);
    if (tempInput && tempInput.rows.length > 0) {
      // Convert HTMLCollection to an array
      const rowsArray = Array.from(tempInput.rows);

      rowsArray.forEach((row: any) => {
        const lastCell = row.lastChild;

        if (lastCell) {
          row.removeChild(lastCell);
        }
      });
    }
    var wb = XLSX.utils.table_to_book(tempInput, { sheet: "sheet1" });
    XLSX.writeFile(wb, fn + "." + "xlsx");
  }

  return (
    <>
      <div
        id="buttons"
        className="flex justify-center items-center gap-3"
      >
        <Button onClick={() => fnExportToExcel(type)}>Export excel</Button>
        <Button onClick={() => downloadPDF(type)}>Export PDF</Button>
      </div>
      <Table
        className="w-[99%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
        ref={tableRef}
        id="tbl_exporttable_to_xls"
      >
        <TableCaption>{sortedData.length ? "" : `No ${type.toLowerCase()}s found`}</TableCaption>
        <TableHeader>
          <TableRow className="bg-slate-100">
            {columns.map((item, ind: number) => (
              <TableHead key={ind}>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  {item.title}
                  <div id="sort_icons">
                    <AiFillCaretUp onClick={() => handleSort(item.field)} />
                    <AiFillCaretDown
                      onClick={() => handleSort(item.field)}
                      className="mt-[-6px]"
                    />
                  </div>
                </div>
              </TableHead>
            ))}
            {session?.user.isAdmin ? (
              <TableHead className="flex justify-between items-center">
                <div>Actions</div>
                <div
                  id="icon"
                  ref={iconRef}
                  className="rounded-full hover:bg-gray-200 p-2 text-lg cursor-pointer"
                  // onClick={toggleButtons}
                >
                  <PiDotsThreeVerticalBold />
                </div>
              </TableHead>
            ) : (
              ""
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item: any, ind: number) => {
            return (
              <TableRow key={ind}>
                {columns.map((column, i: number) => (
                  <TableCell key={i}>
                    {column.type === "text" || column.type === "number"
                      ? item?.[column.field] || item?.additionalFields?.[column.field] || "null"
                      : ""}
                    {column.type === "image" ? (
                      <Image
                        src={item?.[column.field] || item?.additionalFields?.[column.field] || noImageUrl}
                        alt="image"
                        width={120}
                        height={120}
                        className="object-cover"
                      />
                    ) : (
                      ""
                    )}
                  </TableCell>
                ))}
                {session?.user.isAdmin ? (
                  <TableCell>
                    <div className="flex justify-start items-center gap-4">
                      <Link
                        href={`/${type.toLowerCase()}s/${
                          type === "Vendor" ? item?.vendorId : type === "Product" ? item?.productId : item?.warehouseId
                        }`}
                      >
                        <div
                          title="Edit"
                          className="text-gray-500 rounded-full hover:bg-gray-200 p-2"
                        >
                          <MdEdit className="text-xl" />
                        </div>
                      </Link>
                      <DeleteConfirmation
                        id={item._id}
                        type={type}
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
    </>
  );
};

export default DisplayTable;
