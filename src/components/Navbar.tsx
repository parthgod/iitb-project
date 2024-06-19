import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <div className="absolute animate-slidedown top-0 w-screen z-[100] h-[9vh] flex items-center justify-between px-5">
      <Image
        src="/assets/images/logo.png"
        alt="logo"
        width={200}
        height={200}
      />
      <div className="flex justify-between gap-5">
        <a
          href="https://drive.google.com/file/d/1pEiNQ9-XFeCBnL-c7BAYGX6i3oIgrqMJ/view?usp=sharing"
          target="_blank"
          className="text-white underline"
        >
          User manual
        </a>

        <a
          href="https://voltvault-docs.vercel.app"
          target="_blank"
          className="text-white underline"
        >
          Developer&apos;s documentation
        </a>
      </div>
    </div>
  );
};

export default Navbar;
