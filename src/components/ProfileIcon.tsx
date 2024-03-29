"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { pfp } from "@/lib/constants";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { CiLogout } from "react-icons/ci";
import { IoMdPerson } from "react-icons/io";
import { toast } from "sonner";
import { Button, buttonVariants } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { useState } from "react";

const ProfileIcon = ({ session }: { session: Session }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white h-[8vh] shadow-[rgba(0,_0,_0,_0.24)_0px_-2px_8px] w-full flex items-center justify-start py-2">
      {session ? (
        <Popover
          open={open}
          onOpenChange={setOpen}
        >
          <div className="flex gap-2 pr-2 ml-3 mb-2 items-center">
            <PopoverTrigger>
              <Avatar className="scale-90">
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
              <Avatar className="scale-125 mr-2">
                <AvatarImage src={session?.user.image || pfp} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-lg font-semibold">{session?.user.name}</p>
                <p className="text-base text-gray-500 font-semibold">{session?.user.email}</p>
                <div className="flex gap-4 mt-4">
                  <Link
                    href="/profile"
                    className={buttonVariants({ variant: "outline" }) + "px-4 h-8 text-slate-600 text-base"}
                    onClick={() => setOpen((prev) => !prev)}
                  >
                    Profile
                    <IoMdPerson className="ml-1" />
                  </Link>
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
