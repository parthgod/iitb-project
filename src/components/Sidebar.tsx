"use client";

import { ISIdeMenu } from "@/utils/defaultTypes";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaTable } from "react-icons/fa";
import { GrDocumentUser } from "react-icons/gr";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const { data: session } = useSession();

  const sideMenu: ISIdeMenu[] = [
    {
      name: "Bus",
      route: "/bus",
      icon: <FaTable />,
    },
    {
      name: "Excitation System",
      route: "/excitationSystem",
      icon: <FaTable />,
    },
    {
      name: "Generators",
      route: "/generator",
      icon: <FaTable />,
    },
    {
      name: "Loads",
      route: "/load",
      icon: <FaTable />,
    },
    {
      name: "Series capacitor",
      route: "/seriesCapacitor",
      icon: <FaTable />,
    },
    {
      name: "Shunt capacitor",
      route: "/shuntCapacitor",
      icon: <FaTable />,
    },
    {
      name: "Shunt reactors",
      route: "/shuntReactor",
      icon: <FaTable />,
    },
    {
      name: "Single line diagrams",
      route: "/singleLineDiagram",
      icon: <FaTable />,
    },
    {
      name: "Transformers-Three winding",
      route: "/transformersThreeWinding",
      icon: <FaTable />,
    },
    {
      name: "Transformers-Two winding",
      route: "/transformersTwoWinding",
      icon: <FaTable />,
    },
    {
      name: "Transmission Line",
      route: "/transmissionLine",
      icon: <FaTable />,
    },
    {
      name: "Turbine-Governor",
      route: "/turbineGovernor",
      icon: <FaTable />,
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
        isOpen ? "w-1/6 overflow-auto" : "w-14 scrollbar-hide"
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
        className={`pt-4 w-full transition-all duration-300 ease-in-out flex flex-col gap-5 justify-start items-start scrollbar-hide overflow-x-hidden h-[90vh]`}
      >
        {sideMenu?.map((item, ind: number) => {
          if (item.name === "Requests") {
            if (session?.user.isAdmin)
              return (
                <Link
                  className="text-xl w-full h-fit flex flex-col"
                  key={ind}
                  href={item?.route}
                >
                  <div
                    className={`flex group justify-start items-center gap-2 hover:cursor-pointer hover:text-black p-2 pl-2 active:text-[1.2rem] ${
                      pathname.toString() === item.route.toString() ? "tab bg-gray-200" : "text-white"
                    }`}
                  >
                    <div title={item.name}>{item?.icon}</div>
                    <div
                      className={`flex whitespace-nowrap pr-1 justify-between items-center w-full ${
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
                className={`flex group justify-start items-center gap-2 hover:cursor-pointer hover:text-black transition-[color] w-full duration-300 p-2 pl-2 ease-in-out active:text-[1.2rem] ${
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
