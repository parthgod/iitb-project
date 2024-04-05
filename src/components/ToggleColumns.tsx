"use client";

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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { deleteDefaultParam, toggleDefaultParam } from "@/lib/actions/defaultParams.actions";
import { IColumn } from "@/utils/defaultTypes";
import { reverseUnslug } from "@/utils/helperFunctions";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaColumns } from "react-icons/fa";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

const ToggleColumns = ({ columns, userId }: { columns: IColumn[]; userId: string }) => {
  const [tempColumns, setTempColumns] = useState<IColumn[]>([]);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleTempColumns = (index: number, operationType: "Remove" | "Restore") => {
    const newColumns = tempColumns.map((item, ind) => {
      if (ind === index) {
        if (operationType === "Remove") return { ...item, isHidden: true };
        else return { ...item, isHidden: false };
      } else return item;
    });
    setTempColumns(newColumns);
  };

  const updateColumns = async () => {
    try {
      let operationType: "Hide-One" | "Hide-Many" | "Update-Many" = "Hide-Many";
      let flag = false;
      for (let ind = 0; ind < tempColumns.length; ind++) {
        const item = tempColumns[ind];
        if (columns.find((subItem) => subItem.title == item.title)?.isHidden !== item.isHidden) flag = true;
        if (columns.find((subItem) => subItem.title == item.title)?.isHidden !== item.isHidden && !item.isHidden) {
          operationType = "Update-Many";
          break;
        }
      }
      if (!flag) return setOpen(false);
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
      const response = await deleteDefaultParam(index, pathname, userId);
      if (response.status === 200) {
        toast.success("Column deleted successfully.");
        router.refresh();
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
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger className="flex items-center gap-1">
              <div className="bg-gray-200 flex items-center gap-1 rounded-lg hover:bg-gray-300 p-2">
                <FaColumns />
                <p>Columns</p>
              </div>
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
                    <Badge className={`${column.isHidden ? "bg-red-600" : "bg-green-600"}`}>
                      {column.isHidden ? "Hidden" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger
                        asChild
                        id={`popover-btn-${column.field}`}
                      >
                        <Button variant="outline">Column actions</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-5 flex flex-col gap-2 justify-between items-center shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
                        {column.isHidden ? (
                          <Button
                            variant="outline"
                            className="border-green-600 w-48 text-green-600 hover:bg-green-50 hover:text-green-700"
                            onClick={() => toggleTempColumns(ind, "Restore")}
                          >
                            Restore column
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="border-red-600 w-48 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => toggleTempColumns(ind, "Remove")}
                          >
                            Hide column
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="border-red-600 w-48 text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              Delete column permanently
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                <span className="font-semibold">This action cannot be undone.</span> This will
                                permanently remove column <span className="font-semibold">{column?.title}</span> from{" "}
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
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex gap-2">
          <Button onClick={updateColumns}>Confirm</Button>
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
