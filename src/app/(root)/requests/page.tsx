import { getAllRequests } from "@/lib/actions/requests.actions";
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { convertDate } from "@/utils/helperFunctions";

const RequestsPage = async () => {
  const changes: any = await getAllRequests();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold">User Requests</h1>
      <div className="flex flex-col gap-4 h-[80vh] overflow-auto">
        {changes.data.map((change: any, i: number) => (
          <Card
            className="w-[98%]"
            key={i}
          >
            <CardHeader>
              <div className="flex w-full justify-between items-center">
                <CardTitle className="text-lg">Request by {change?.user?.name}</CardTitle>
                <CardTitle className="text-md font-semibold text-gray-500">{convertDate(change?.date)}</CardTitle>
              </div>
              <CardDescription className="text-sm">{change?.user?.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{change?.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RequestsPage;
