import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <div className="absolute animate-slidedown top-0 w-screen z-[100] h-[9vh] flex items-center justify-between px-5">
      <Image
        src="/images/logo.png"
        alt="logo"
        width={200}
        height={200}
      />
      <p className="text-white">User manual</p>
    </div>
  );
};

export default Navbar;
