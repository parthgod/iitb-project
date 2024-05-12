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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteManyModificationHistory, deleteModificationHistory } from "@/lib/actions/modificationHistory.actions";
import { pfp } from "@/lib/constants";
import { IModificationHistory } from "@/utils/defaultTypes";
import { convertDate } from "@/utils/helperFunctions";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MdDelete, MdDeleteOutline } from "react-icons/md";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PaginationComponent from "./PaginationComponent";

const PrintModificationHistory = ({
  modificationHistory,
  isAdmin,
  totalDocuments,
  page,
  limit,
  totalEntries,
  totalPages,
  completeData
}: {
  modificationHistory: IModificationHistory[];
  completeData?: IModificationHistory[];
  isAdmin: boolean;
  totalDocuments?: number
  page?: number
  limit?: number
  totalEntries?: number
  totalPages?: number
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [recordsToDelete, setRecordsToDelete] = useState<string[]>([]);

  const router = useRouter();

  const pathname = usePathname();
  let [isPending, startTransition] = useTransition();

  const handleRecordsToDelete = (e: any, id: string) => {
    const isChecked = e.target.checked;
    setRecordsToDelete((prevSelectedIds) => {
      if (isChecked) {
        return [...prevSelectedIds, id];
      } else {
        return prevSelectedIds.filter((selectedId) => selectedId !== id);
      }
    });
  };

  const handleDeleteModificationHistory = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await deleteModificationHistory(id);
      if (response.status === 200) {
        toast.success(response.data);
        setIsLoading(false);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex px-4 justify-between items-center my-1">
        {totalDocuments ? (
          <p className="font-semibold whitespace-nowrap flex">
            {isAdmin && limit && completeData && <input
              type="checkbox"
              className="scale-125 cursor-pointer mr-2"
              checked={recordsToDelete.length >= limit || recordsToDelete.length === totalDocuments || recordsToDelete.length === modificationHistory.length}
              onChange={(e) => {
                if (e.target.checked)
                  modificationHistory.map(
                    (item) =>
                      !recordsToDelete.includes(item._id) &&
                      setRecordsToDelete((prevSelectedIds: string[]) => [...prevSelectedIds, item._id])
                  );
                else setRecordsToDelete([]);
              }}
            />}
            {recordsToDelete.length ? (
              <span className="flex items-center">
                {recordsToDelete.length} record{recordsToDelete.length > 1 ? <>s</> : ""} selected{" "}
                {recordsToDelete.length !== totalDocuments ? (
                  <span className="ml-1">
                    {" "}
                    on this page.{" "}
                    <span
                      className="cursor-pointer text-blue-600 font-bold hover:underline"
                      onClick={() =>
                        completeData!.map(
                          (item) =>
                            !recordsToDelete.includes(item._id) &&
                            setRecordsToDelete((prevSelectedIds: string[]) => [...prevSelectedIds, item._id])
                        )
                      }
                    >
                      Select all {totalDocuments} records?
                    </span>
                  </span>
                ) : (
                  ""
                )}
                <AlertDialog>
                  <AlertDialogTrigger>
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                          <div className="flex justify-center items-center ml-1 cursor-pointer p-2 hover:bg-gray-200 rounded-full">
                            <MdDelete className="text-lg" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Delete</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete {recordsToDelete.length} records from history log.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 hover:bg-red-700"
                        onClick={() =>
                          startTransition(async () => {
                            const res = await deleteManyModificationHistory(recordsToDelete, pathname)
                            toast.success(res?.data);
                            setRecordsToDelete([]);
                            router.push('/historyLog')
                          })
                        }
                      >
                        {isPending ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </span>
            ) : (
              <span>
                Showing {(Number(page) - 1) * limit! + 1} - {totalEntries! > totalDocuments ? totalDocuments : totalEntries}{" "}
                of {totalDocuments} records
              </span>
            )}
          </p>
        ) : (
          <p className="font-semibold whitespace-nowrap">No records to display</p>
        )}
        <PaginationComponent
          limit={limit!}
          totalDocuments={totalDocuments!}
          totalPages={totalPages!}
          recordsToDelete={recordsToDelete}
          setRecordsToDelete={setRecordsToDelete}
        />
      </div>
      <div className="flex flex-col gap-4 h-[77vh] overflow-auto custom-scrollbar px-3 pr-4 pb-2">
        {modificationHistory.map((item, i: number) => (
          <Card
            className={`w-full flex py-4 p-5 group items-center ${recordsToDelete.includes(item._id) ? 'bg-[#ececec]' : ''}`}
            key={i}
          >
            {isAdmin && <input
              type="checkbox"
              className="mr-3 cursor-pointer size-5"
              onChange={(e) => handleRecordsToDelete(e, item._id)}
              checked={recordsToDelete.includes(item._id)}
            />}
            <div className="flex flex-col justify-between items-center mr-4">
              <Avatar className="scale-100">
                <AvatarImage src={item?.userId?.image || pfp} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              {!isLoading && isAdmin ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div
                      title="Delete modification history"
                      className="rounded-full hover:bg-gray-200 p-2 cursor-pointer invisible group-hover:visible"
                    >
                      <MdDeleteOutline className="text-gray-500 text-2xl" />
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently this modification history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 hover:bg-red-700"
                        onClick={() => handleDeleteModificationHistory(item._id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                ""
              )}
            </div>
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
                <div
                  className="text-base"
                  dangerouslySetInnerHTML={{ __html: item.message }}
                />
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
};

export default PrintModificationHistory;
