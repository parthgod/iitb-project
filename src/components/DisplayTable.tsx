"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { noImageUrl } from "@/lib/constants";
import { IColumn } from "@/lib/database/models/defaultParams";
import { IVendor } from "@/lib/database/models/vendor";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import DeleteConfirmation from "./DeleteConfirmation";

interface TableProps {
  columns: IColumn[];
  data: any;
  type: "Vendor" | "Warehouse" | "Product";
}

const DisplayTable = ({ columns, data, type }: TableProps) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const tableRef = useRef(null);

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

  return (
    <Table
      className="w-[99%] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
      ref={tableRef}
    >
      <TableCaption>{sortedData.length ? "" : `No ${type.toLowerCase()}s found`}</TableCaption>
      <TableHeader>
        <TableRow className="bg-slate-100">
          {columns.map((item, ind: number) => (
            <TableHead key={ind}>
              <div className="flex items-center gap-2 whitespace-nowrap">
                {item.title}
                <div>
                  <AiFillCaretUp onClick={() => handleSort(item.field)} />
                  <AiFillCaretDown
                    onClick={() => handleSort(item.field)}
                    className="mt-[-6px]"
                  />
                </div>
              </div>
            </TableHead>
          ))}
          <TableHead>Actions</TableHead>
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
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default DisplayTable;
