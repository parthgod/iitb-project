"use client";

import { pfp } from "@/lib/constants";
import { convertDate } from "@/utils/helperFunctions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IUser } from "@/utils/defaultTypes";
import { updateUserStatus } from "@/lib/actions/users.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const UsersTable = ({ users }: { users: IUser[] }) => {
  const router = useRouter();

  const accountActions = async (typeOfAction: "disable" | "enable", userId: string) => {
    try {
      const response = await updateUserStatus(userId, typeOfAction === "disable" ? true : false);
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
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Last login</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Account actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, ind) => (
            <TableRow key={user._id}>
              <TableCell className="flex items-center gap-2">
                <Avatar className="scale-90">
                  <AvatarImage src={user.image || pfp} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                {user.name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{convertDate(user.createdAt)}</TableCell>
              <TableCell>{convertDate(user.latestLoginTime)}</TableCell>
              <TableCell>
                <Badge className={`${user.disabled ? "bg-red-600" : "bg-green-600"}`}>
                  {user.disabled ? "Disabled" : "Active"}
                </Badge>
              </TableCell>
              <TableCell>
                {!user.disabled ? (
                  <Button
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => accountActions("disable", user._id)}
                  >
                    Disable user
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                    onClick={() => accountActions("enable", user._id)}
                  >
                    Enable user
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
