"use client";

import { ILoginRequest } from "@/utils/defaultTypes";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { pfp } from "@/lib/constants";
import { convertDate } from "@/utils/helperFunctions";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { deleteLoginRequest, updateLoginRequestStatus } from "@/lib/actions/loginRequest.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

type IPrintLoginRequests = {
  data: ILoginRequest[];
};

const PrintLoginRequests = ({ data }: IPrintLoginRequests) => {
  const router = useRouter();

  const handleRequestChange = async (id: string, status: string) => {
    try {
      const response = await updateLoginRequestStatus(status, id);
      if (response.status === 200) {
        toast.success(response.data);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveRequest = async (id: string) => {
    try {
      const response = await deleteLoginRequest(id);
      if (response.status === 200) {
        toast.success(response.data);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Request made at</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, ind) => (
            <TableRow
              key={ind}
              className="group"
            >
              <TableCell className="flex items-center gap-2">
                <Avatar className="scale-75">
                  <AvatarImage src={item.image || pfp} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                {item.name}
              </TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{convertDate(item.time)}</TableCell>
              <TableCell>
                <Badge className={`${item.status === "Pending" ? "bg-purple-600" : "bg-red-600"}`}>{item.status}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2">
                    {item.status !== "Rejected" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            Reject request
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              User <span className="font-semibold">{item.name}</span> won&apos;t be able to access the
                              database.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-700"
                              onClick={() => handleRequestChange(item._id, "Rejected")}
                            >
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                        >
                          Accept request
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            <span className="font-semibold">This action cannot be undone</span>. User{" "}
                            <span className="font-semibold">{item.name}</span> will be able to access the database. If
                            you want to disable this user, please go to <span className="font-semibold">Users</span>{" "}
                            tab.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-700"
                            onClick={() => handleRequestChange(item._id, "accept")}
                          >
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
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
                          <span className="font-semibold">This action cannot be undone</span>. This will permanently
                          remove user <span className="font-semibold">{item.name}&apos;s</span> login request. The user
                          will have to once again request for access.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-500 hover:bg-red-700"
                          onClick={() => handleRemoveRequest(item._id)}
                        >
                          Confirm
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
  );
};

export default PrintLoginRequests;
