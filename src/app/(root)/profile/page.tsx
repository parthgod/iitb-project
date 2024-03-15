import { authOptions } from "@/lib/authOptions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllModificationsHistory } from "@/lib/actions/modificationHistory.actions";
import { pfp } from "@/lib/constants";
import { getServerSession } from "next-auth";
import React from "react";
import { PrintModification } from "../historyLog/page";
import { getAllRequests } from "@/lib/actions/requests.actions";
import SecuritySetting from "@/components/SecuritySetting";
import Link from "next/link";
import PrintRequests from "@/components/PrintRequests";

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);
  const { data: modifications } = await getAllModificationsHistory({
    type: "",
    databaseName: "",
    query: session?.user.name!,
  });
  const { data: defaultParams } = await getDefaultParams();
  const { data: requests } = await getAllRequests({ query: session?.user.name! });

  return (
    <main className="p-10 w-full flex flex-col gap-2">
      <div className="flex gap-10 items-center ml-5">
        <Avatar className="scale-[2.5]">
          <AvatarImage src={session?.user.image || pfp} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-4xl">{session?.user.name}</p>
          <p className="text-gray-500">{session?.user.email}</p>
        </div>
      </div>
      <Separator className="mt-5" />
      {modifications.length ? (
        <div className="py-2">
          <div className="flex justify-between items-center mt-2">
            <h1 className="text-2xl font-bold mb-3">Recent actions performed by you:</h1>
            <Link
              href={`/historyLog?query=${session?.user.name!}`}
              className="text-lg text-gray-500"
            >
              See all &rarr;
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <PrintModification
              modificationHistory={modifications.slice(0, 3)}
              defaultParams={defaultParams}
            />
          </div>
          <Separator className="mt-5" />
        </div>
      ) : (
        ""
      )}
      {requests.length ? (
        <div className="py-2">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-3">Recent requests made by you:</h1>
            <Link
              href={`/requests`}
              className="text-lg text-gray-500"
            >
              See all &rarr;
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <PrintRequests
              requests={requests.slice(0, 3)}
              isAdmin={session?.user.isAdmin!}
            />
          </div>
          <Separator className="mt-5" />
        </div>
      ) : (
        ""
      )}
      {!session?.user.image && <SecuritySetting session={session!} />}
      <Separator className="mt-2" />
    </main>
  );
};

export default ProfilePage;
