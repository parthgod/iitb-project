"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LuCodesandbox, LuWarehouse } from "react-icons/lu";
import { MdOutlineStoreMallDirectory } from "react-icons/md";
import { GrDocumentUser } from "react-icons/gr";
import { Button } from "./ui/button";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const { data: session } = useSession();

  const sideMenu = [
    {
      name: "Vendors",
      route: "/vendors",
      addUrl: "/create/vendor",
      icon: <MdOutlineStoreMallDirectory />,
    },
    {
      name: "Products",
      route: "/products",
      addUrl: "/customers/new",
      icon: <LuCodesandbox />,
    },
    {
      name: "Warehouses",
      route: "/warehouses",
      addUrl: "/warehouses/new",
      icon: <LuWarehouse />,
    },
    {
      name: "Requests",
      route: "/requests",
      icon: <GrDocumentUser />,
    },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`h-screen bg-[#1E40AF] text-white transition-all duration-200 ease-in-out pl-3 ${
        isOpen ? "w-1/6 overflow-auto" : "w-14 overflow-hidden"
      } border-r-0 border-gray-200 scrollbar-hide`}
    >
      <input
        className="check-icon"
        id="check-icon"
        name="check-icon"
        type="checkbox"
        checked={isOpen}
        onChange={toggleSidebar}
      />
      <label
        className="icon-menu"
        htmlFor="check-icon"
      >
        <div className="bar bar--1"></div>
        <div className="bar bar--2"></div>
        <div className="bar bar--3"></div>
      </label>
      <div
        className={`pt-4 w-full transition-all duration-300 ease-in-out flex flex-col gap-5 justify-start items-start overflow-hidden h-[90vh]`}
      >
        {sideMenu?.map((item: any, ind: any) => {
          if (item.name === "Requests") {
            if (session?.user.isAdmin)
              return (
                <Link
                  className="text-xl w-full h-fit flex flex-col"
                  key={ind}
                  href={item?.route}
                >
                  <div
                    className={`flex group justify-start items-center gap-2 hover:cursor-pointer hover:text-black transition-color w-full duration-300 p-2 pl-2 ease-in-out active:text-lg ${
                      pathname.toString() === item.route.toString() ? "tab bg-gray-200" : "text-white"
                    }`}
                  >
                    <div title={item.name}>{item?.icon}</div>
                    <div
                      className={`flex pr-1 justify-between items-center w-full ${
                        isOpen ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {item?.name}
                    </div>
                  </div>
                </Link>
              );
            else return null;
          }

          return (
            <Link
              className="text-xl w-full h-fit flex flex-col"
              key={ind}
              href={item?.route}
            >
              <div
                className={`flex group justify-start items-center gap-2 hover:cursor-pointer hover:text-black transition-color w-full duration-300 p-2 pl-2 ease-in-out active:text-lg ${
                  pathname.toString() === item.route.toString() ? "tab bg-gray-200" : "text-white"
                }`}
              >
                <div title={item.name}>{item?.icon}</div>
                <div
                  className={`flex pr-1 justify-between items-center w-full ${isOpen ? "opacity-100" : "opacity-0"}`}
                >
                  {item?.name}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
