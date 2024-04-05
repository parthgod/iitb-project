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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteUser, toggleUserAdminStatus, updateUserStatus } from "@/lib/actions/users.actions";
import { pfp } from "@/lib/constants";
import { IUser } from "@/utils/defaultTypes";
import { convertDate } from "@/utils/helperFunctions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const UsersTable = ({ users }: { users: IUser[] }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const accountActions = async (typeOfAction: "disable" | "enable", userId: string) => {
    const toastLoading = toast.loading("Processing...");
    setIsLoading(true);
    try {
      const response = await updateUserStatus(userId, typeOfAction === "disable" ? true : false);
      if (response.status === 200) {
        const popoverBtn = document.getElementById(`popover-btn-${userId}`);
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

  const handleDeleteUser = async (id: string) => {
    const toastLoading = toast.loading("Processing...");
    setIsLoading(true);
    try {
      const response = await deleteUser(id);
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

  const handleToggleUserAdmin = async (id: string, adminStatus: string) => {
    const toastLoading = toast.loading("Processing...");
    setIsLoading(true);
    try {
      const response = await toggleUserAdminStatus(id, adminStatus === "admin");
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
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Last login</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Admin Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, ind) => (
            <TableRow
              key={user._id}
              className="group"
            >
              <TableCell className="flex items-center gap-2">
                <Avatar className="scale-90">
                  <AvatarImage src={user.image || pfp} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                {user.name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{convertDate(user.createdAt)}</TableCell>
              <TableCell className={`${!user.latestLoginTime && "italic text-gray-400"}`}>
                {user.latestLoginTime ? convertDate(user.latestLoginTime) : "null"}
              </TableCell>
              <TableCell>
                <Badge className={`${user.disabled ? "bg-red-600" : "bg-green-600"}`}>
                  {user.disabled ? "Disabled" : "Active"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={`${user.isAdmin ? "bg-blue-600" : "bg-gray-600"}`}>
                  {user.isAdmin ? "Admin" : "User"}
                </Badge>
              </TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger
                    asChild
                    id={`popover-btn-${user._id}`}
                  >
                    <Button variant="outline">Account actions</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-5 flex flex-col gap-2 justify-between items-center shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
                    {!user.disabled ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            disabled={isLoading}
                            variant="outline"
                            className="border-red-600 w-48 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            Disable user
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              User <span className="font-semibold">{user.name}</span> will be disabled won&apos;t be
                              able to access the application.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-700"
                              onClick={() => accountActions("disable", user._id)}
                            >
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            disabled={isLoading}
                            variant="outline"
                            className="border-green-600 w-48 text-green-600 hover:bg-green-50 hover:text-green-700"
                          >
                            Enable user
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              User <span className="font-semibold">{user.name}</span> won&apos;t be disabled anymore and
                              they can access the application.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-700"
                              onClick={() => accountActions("enable", user._id)}
                            >
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}

                    {!isLoading && !user.disabled ? (
                      !user.isAdmin ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              disabled={isLoading}
                              variant="outline"
                              className="w-48 border-blue-600 text-blue-500 hover:text-blue-600"
                            >
                              Make user admin
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will make user <span className="font-semibold">{user.name}</span> admin. The user
                                will gain access to all admin privileges.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-700"
                                onClick={() => handleToggleUserAdmin(user._id, "admin")}
                              >
                                Confirm
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              disabled={isLoading}
                              variant="outline"
                              className="w-48 border-blue-600 text-blue-500 hover:text-blue-600"
                            >
                              Remove user as admin
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                User <span className="font-semibold">{user.name}</span> will no longer be an admin. The
                                user will be revoked of all admin privileges.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-700"
                                onClick={() => handleToggleUserAdmin(user._id, "user")}
                              >
                                Confirm
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )
                    ) : (
                      ""
                    )}

                    {!isLoading ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            disabled={isLoading}
                            variant="outline"
                            className="border-red-600 w-48 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            Remove user permanently
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              <span className="font-semibold">This action cannot be undone</span>. This will permanently
                              remove user <span className="font-semibold">{user.name}</span>. The user will have to once
                              again request for accessing the application.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-700"
                              onClick={() => handleDeleteUser(user._id)}
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

export default UsersTable;
