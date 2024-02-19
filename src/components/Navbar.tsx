"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { pfp } from "@/lib/constants";
import { signOut, useSession } from "next-auth/react";
import { CiLogout } from "react-icons/ci";
import { toast } from "sonner";

const Navbar = () => {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div className="absolute right-7 top-5">
      {session ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Avatar className="scale-110">
              <AvatarImage src={session.user.image || pfp} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base">{session.user.name}</p>
              <p className="text-xs text-gray-500">{session.user.email}</p>
            </div>
          </div>

          <CiLogout
            className="text-3xl cursor-pointer"
            title="Logout"
            onClick={() => {
              signOut();
              toast.loading("Logging out...");
            }}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Navbar;
