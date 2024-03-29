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
import { deleteModificationHistory } from "@/lib/actions/modificationHistory.actions";
import { pfp } from "@/lib/constants";
import { IModificationHistory } from "@/utils/defaultTypes";
import { convertDate } from "@/utils/helperFunctions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "sonner";

const PrintModificationHistory = ({
  modificationHistory,
  isAdmin,
}: {
  modificationHistory: IModificationHistory[];
  isAdmin: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

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

  return modificationHistory.map((item, i: number) => (
    <Card
      className="w-full flex py-4 p-5 group"
      key={i}
    >
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
  ));
};

export default PrintModificationHistory;
