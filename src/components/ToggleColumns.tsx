"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IColumn } from "@/utils/defaultTypes";
import { reverseUnslug } from "@/utils/helperFunctions";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { deleteDefaultParam, toggleDefaultParam } from "@/lib/actions/defaultParams.actions";
import { toast } from "sonner";
import { FaColumns } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FaXmark } from "react-icons/fa6";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ToggleColumns = ({ columns, userId }: { columns: IColumn[]; userId: string }) => {
  const [tempColumns, setTempColumns] = useState<IColumn[]>([]);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleTempColumns = (index: number, operationType: "Remove" | "Restore") => {
    const newColumns = tempColumns.map((item, ind) => {
      if (ind === index) {
        if (operationType === "Remove") return { ...item, isRemoved: true };
        else return { ...item, isRemoved: false };
      } else return item;
    });
    setTempColumns(newColumns);
  };

  const removeColumn = async () => {
    try {
      let operationType: "Remove-One" | "Remove-Many" | "Update-Many" = "Remove-Many";
      for (let ind = 0; ind < tempColumns.length; ind++) {
        const item = tempColumns[ind];
        if (columns.find((subItem) => subItem.title == item.title)?.isRemoved !== item.isRemoved && !item.isRemoved) {
          operationType = "Update-Many";
          break;
        }
      }
      const response = await toggleDefaultParam(pathname, userId, 0, operationType, tempColumns);
      if (response.status === 200) {
        toast.success("Columns updated successfully.");
        router.refresh();
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteColumnPermanently = async (index: number) => {
    try {
      const response = await deleteDefaultParam(index, pathname);
      if (response.status === 200) {
        toast.success("Column deleted successfully.");
        router.refresh();
        // setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTempColumns(columns);
  }, [columns]);

  useEffect(() => {
    if (!open) setTempColumns(columns);
  }, [open, columns]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger className="bg-gray-200 flex items-center gap-1 rounded-lg hover:bg-gray-300 p-2">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger className="flex items-center gap-1">
              <FaColumns />
              <p>Columns</p>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Column details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="bg-white max-h-full max-w-[70vw] overflow-auto custom-scrollbar">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="text-center">Details of all columns</DialogTitle>
          <Separator />
        </DialogHeader>
        <div className="relative flex items-start justify-start w-full overflow-auto custom-scrollbar max-h-[55vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Column Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tempColumns.map((column, ind) => (
                <TableRow
                  key={ind}
                  className="group"
                >
                  <TableCell>{column.title}</TableCell>
                  <TableCell>{reverseUnslug(column.type)}</TableCell>
                  <TableCell>
                    <Badge className={`${column.isRemoved ? "bg-red-600" : "bg-green-600"}`}>
                      {column.isRemoved ? "Removed" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-between items-center gap-2">
                      {column.isRemoved ? (
                        <Button
                          variant="outline"
                          className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                          onClick={() => toggleTempColumns(ind, "Restore")}
                        >
                          Restore column
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => toggleTempColumns(ind, "Remove")}
                        >
                          Remove column
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <div className="rounded-full p-2 hover:bg-gray-300 cursor-pointer opacity-0 group-hover:opacity-100">
                            <FaXmark
                              title="Delete permanently"
                              className="text-lg"
                            />
                          </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently remove column{" "}
                              <span className="font-semibold">{column?.title}</span> from{" "}
                              <span className="font-semibold">{reverseUnslug(pathname)}</span> table.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-700"
                              onClick={() => deleteColumnPermanently(ind)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex gap-2">
          <Button onClick={removeColumn}>Confirm</Button>
          <Button
            variant="destructive"
            onClick={() => {
              setOpen((prev) => !prev);
            }}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ToggleColumns;
