"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { pfp } from "@/lib/constants";
import { signOut, useSession } from "next-auth/react";
import { CiLogout } from "react-icons/ci";

const Navbar = () => {
  const { data: session } = useSession();

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
              <p className="text-lg">{session.user.name}</p>
              <p className="text-xs text-gray-500">{session.user.email}</p>
            </div>
          </div>

          <CiLogout
            className="text-3xl cursor-pointer"
            title="Logout"
            onClick={() => {
              signOut();
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
