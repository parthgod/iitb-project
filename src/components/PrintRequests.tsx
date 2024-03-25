"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateRequest } from "@/lib/actions/requests.actions";
import { pfp } from "@/lib/constants";
import { IRequest } from "@/utils/defaultTypes";
import { convertDate } from "@/utils/helperFunctions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";

const PrintRequests = ({ requests, isAdmin }: { requests: IRequest[]; isAdmin: boolean }) => {
  const [isMounted, SetIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    SetIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return requests.map((request, i: number) => (
    <Card
      className="w-full flex py-4 p-5"
      key={i}
    >
      <Avatar className="scale-100 mr-4">
        <AvatarImage src={request.user.image || pfp} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="w-full">
        <CardHeader className="p-0 pb-4">
          <div className="flex w-full justify-between items-center">
            <div className="flex gap-3">
              <CardTitle className="text-lg">Request by {request?.user?.name}</CardTitle>
              {isAdmin && (
                <Badge
                  className={`scale-[0.85] ${
                    request.status === "Pending"
                      ? "bg-purple-600"
                      : request.status === "Completed"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {request.status}
                </Badge>
              )}
            </div>
            <CardTitle className="text-md font-semibold text-gray-500">{convertDate(request?.date)}</CardTitle>
          </div>
          <div className="flex w-full justify-between items-center">
            <CardDescription className="text-sm">{request?.user?.email}</CardDescription>
            {isAdmin && (
              <div className="flex gap-3">
                <Button
                  className={`h-6 w-6 p-1 border-[1px] border-green-600 text-green-600 hover:text-green-600 ${
                    request.status === "Completed" && "bg-green-600 text-white hover:text-white hover:bg-green-700"
                  }`}
                  variant="outline"
                  title="Accept request"
                  onClick={async () => {
                    await updateRequest({ id: request._id, status: true });
                    toast.success("Request updated successfully");
                    router.refresh();
                  }}
                >
                  <FaCheck />
                </Button>
                <Button
                  className={`h-6 w-6 p-1 border-[1px] border-red-600 text-red-600 hover:text-red-600 ${
                    request.status === "Rejected" && "bg-red-600 text-white hover:text-white hover:bg-red-700"
                  }`}
                  variant="outline"
                  title="Reject request"
                  onClick={async () => {
                    await updateRequest({ id: request._id, status: false });
                    toast.success("Request updated successfully");
                    router.refresh();
                  }}
                >
                  <IoClose />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-sm">{request?.message}</p>
        </CardContent>
      </div>
    </Card>
  ));
};

export default PrintRequests;
