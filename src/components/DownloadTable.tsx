"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { noImageUrl } from "@/lib/constants";
import { IColumn } from "@/lib/database/models/defaultParams";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import DeleteConfirmation from "./DeleteConfirmation";
import { Button } from "./ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx/xlsx.mjs";

interface TableProps {
  columns: IColumn[];
  data: any;
  type: "Vendor" | "Warehouse" | "Product";
}

const DowloadTable = ({ columns, data, type }: TableProps) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: type,
    sheet: type,
  });

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

  const downloadPDF = async () => {
    const input: any = tableRef.current;
    const originalVisibility = input.style.visibility;
    try {
      input.style.visibility = "visible";
      const canvas = await html2canvas(input);
      input.style.visibility = originalVisibility;
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("document.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
    }
  };

  function fnExportToExcel(fn: any) {
    var elt = document.getElementById("tbl_exporttable_to_xls");
    var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
    XLSX.writeFile(wb, fn + "." + "xlsx");
  }

  function exportToExcel(filename = "") {
    var downloadLink;
    var dataType = "application/vnd.ms-excel";
    var tableSelect: any = document.getElementById("tbl_exporttable_to_xls");
    var tableHTML = tableSelect.outerHTML.replace(/ /g, "%20");

    // Specify file name
    filename = filename ? filename + ".xls" : "excel_data.xls";

    // Create download link element
    downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    // Create a link to the file
    downloadLink.href = "data:" + dataType + ", " + tableHTML;

    // Setting the file name
    downloadLink.download = filename;

    //triggering the function
    downloadLink.click();
  }

  return (
    <>
      <div
        id="buttons"
        className="flex justify-center flex-col items-center gap-3 absolute top-1/4 bg-white p-5 shadow-xl shadow-black invisible"
      >
        <Button onClick={() => fnExportToExcel(type)}>Export excel</Button>
        <Button onClick={downloadPDF}>Export PDF</Button>
      </div>
      <table
        className="w-[99%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] absolute left-[-9999px] top-[-9999px]"
        ref={tableRef}
        id="tbl_exporttable_to_xls"
      >
        <thead>
          <tr className="bg-slate-100">
            {columns.map((item, ind: number) => (
              <th key={ind}>{item.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item: any, ind: number) => {
            return (
              <tr key={ind}>
                {columns.map((column, i: number) => (
                  <td key={i}>
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
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default DowloadTable;
