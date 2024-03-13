"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { pfp } from "@/lib/constants";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { CiLogout } from "react-icons/ci";
import { IoMdSettings } from "react-icons/io";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

const ProfileIcon = ({ session }: { session: Session }) => {
  return (
    <div className="pb-3 bg-white h-[10vh] shadow-[rgba(0,_0,_0,_0.24)_0px_-2px_8px] w-full flex items-center justify-start pt-2">
      {session ? (
        <Popover>
          <div className="flex gap-3 pr-2 ml-3 items-center">
            <PopoverTrigger>
              <Avatar className="scale-110">
                <AvatarImage src={session?.user.image || pfp} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <p className="text-base">{session?.user.name}</p>
          </div>
          <PopoverContent
            className="p-5 pl-8 w-full shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]"
            sideOffset={8}
            align="start"
          >
            <div className="flex gap-4">
              <Avatar className="scale-150">
                <AvatarImage src={session?.user.image || pfp} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-lg font-semibold">{session?.user.name}</p>
                <p className="text-base text-gray-500 font-semibold">{session?.user.email}</p>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="px-4 h-8 text-slate-600 text-base"
                  >
                    Manage account
                    <IoMdSettings className="ml-1" />
                  </Button>
                  <Button
                    onClick={() => {
                      signOut();
                      toast.loading("Logging out...");
                    }}
                    variant="outline"
                    className="px-4 h-8 text-slate-600 text-base"
                  >
                    Sign out
                    <CiLogout className="ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="flex gap-3 pr-2 ml-3 items-center h-10">
          <Skeleton className="rounded-full h-10 w-10 bg-gray-400" />
          <Skeleton className="rounded-md h-8 w-28 bg-gray-400" />
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
