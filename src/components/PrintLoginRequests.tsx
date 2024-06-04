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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { deleteLoginRequest, updateLoginRequestStatus } from "@/lib/actions/loginRequest.actions";
import { pfp } from "@/lib/constants";
import { ILoginRequest } from "@/utils/defaultTypes";
import { convertDate } from "@/utils/helperFunctions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

type IPrintLoginRequests = {
  data: ILoginRequest[];
};

const PrintLoginRequests = ({ data }: IPrintLoginRequests) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestChange = async (id: string, status: string) => {
    const toastLoading = toast.loading("Processing...");
    setIsLoading(true);
    try {
      const response = await updateLoginRequestStatus(status, id);
      if (response.status === 200) {
        const popoverBtn = document.getElementById(`popover-btn-${id}`);
        if (popoverBtn) popoverBtn.click();
        toast.dismiss(toastLoading);
        toast.success(response.data);
        setIsLoading(false);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveRequest = async (id: string) => {
    const toastLoading = toast.loading("Processing...");
    setIsLoading(true);
    try {
      const response = await deleteLoginRequest(id);
      if (response.status === 200) {
        const popoverBtn = document.getElementById(`popover-btn-${id}`);
        if (popoverBtn) popoverBtn.click();
        toast.dismiss(toastLoading);
        toast.success(response.data);
        setIsLoading(false);
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
                <Popover>
                  <PopoverTrigger
                    asChild
                    id={`popover-btn-${item._id}`}
                  >
                    <Button
                      variant="outline"
                      className="h-8"
                    >
                      Request actions
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-5 flex flex-col gap-2 justify-between items-center shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
                    {item.status !== "Rejected" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            disabled={isLoading}
                            variant="outline"
                            className="border-red-600 w-48 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            Reject request
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              User <span className="font-semibold">{item.name}</span> won&apos;t be able to access the
                              application.
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
                          disabled={isLoading}
                          variant="outline"
                          className="border-green-600 w-48 text-green-600 hover:bg-green-50 hover:text-green-700"
                        >
                          Accept request
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            <span className="font-semibold">This action cannot be undone</span>. User{" "}
                            <span className="font-semibold">{item.name}</span> will be able to access the application.
                            If you want to disable this user, please go to <span className="font-semibold">Users</span>{" "}
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
                    {!isLoading ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            disabled={isLoading}
                            variant="outline"
                            className="border-red-600 w-48 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            Delete request permanently
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              <span className="font-semibold">This action cannot be undone</span>. This will permanently
                              remove user <span className="font-semibold">{item.name}&apos;s</span> login request. The
                              user will have to once again request for access.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-700"
                              onClick={() => handleRemoveRequest(item._id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      ""
                    )}
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PrintLoginRequests;
