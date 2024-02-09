"use client";

import { useRef } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TableProps {
  columns: any;
  data: any;
  handleDelete: Function;
}

const Table = ({ columns, data, handleDelete }: TableProps) => {
  const tableRef = useRef(null);
  const router = useRouter();

  return (
    <div>
      <table
        className="border-2 border-collapse border-black"
        ref={tableRef}
      >
        <thead>
          <tr className="border-2">
            {columns.map((item: any, ind: any) => (
              <th
                key={ind}
                className="border-2 border-black p-3"
              >
                {item.title}
              </th>
            ))}
            <th className="border-2 border-black p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: any, ind: number) => {
            return (
              <tr key={ind}>
                {columns.map((column: any, i: any) => (
                  <td
                    key={i}
                    className="border-2 border-black p-3"
                  >
                    {item?.[column.field] || item?.additionalFields?.[column.field] || "null"}
                  </td>
                ))}
                <td className="border-2 border-black p-3">
                  <div className="flex justify-start items-center gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => router.push(`/vendor/${item?.vendorId}`)}
                    >
                      Edit
                    </Button>
                    <Dialog>
                      <DialogTrigger>
                        <Button variant="destructive">Delete</Button>
                      </DialogTrigger>
                      <DialogContent className="flex flex-col justify-center items-center">
                        <DialogHeader>
                          <DialogTitle className="text-center">Are you absolutely sure?</DialogTitle>
                          <DialogDescription className="text-center">
                            This action cannot be undone. This will permanently delete this vendor from our servers.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="sm:justify-start">
                          <DialogClose asChild>
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => handleDelete(item._id)}
                            >
                              Delete
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
