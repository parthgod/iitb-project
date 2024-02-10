"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BsPeopleFill } from "react-icons/bs";
import { LuWarehouse } from "react-icons/lu";
import { MdOutlineInventory2, MdOutlineStoreMallDirectory } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const sideMenu = [
    {
      name: "Vendors",
      route: "/",
      addUrl: "/create/vendor",
      icon: <MdOutlineStoreMallDirectory />,
    },
    // {
    //   name: "Warehouses",
    //   route: "/warehouses",
    //   addUrl: "/warehouses/new",
    //   icon: <LuWarehouse />,
    // },
    // {
    //   name: "Customers",
    //   route: "/customers",
    //   addUrl: "/customers/new",
    //   icon: <BsPeopleFill />,
    // },
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
        className={`pt-4 w-full transition-all duration-300 ease-in-out flex flex-col gap-5 justify-start items-start overflow-hidden`}
      >
        {sideMenu?.map((item: any, ind: any) => (
          <div
            className="text-xl w-full h-full flex flex-col"
            key={ind}
            onClick={() => router.push(item?.route)}
          >
            <div
              className={`flex group justify-start items-center gap-2 hover:cursor-pointer hover:text-black transition-color w-full duration-300 p-1 pl-2 ease-in-out active:text-lg ${
                pathname.toString() === item.route.toString() ? "tab bg-gray-200" : "text-white"
              }`}
            >
              <div>{item?.icon}</div>
              <div className={`flex pr-1 justify-between items-center w-full ${isOpen ? "opacity-100" : "opacity-0"}`}>
                {item?.name}
                {item?.addUrl && (
                  <div
                    className="opacity-0 hover:text-gray-700 group-hover:opacity-100 text-3xl"
                    onClick={(e) => {
                      router.push(item?.addUrl);
                      e.stopPropagation();
                    }}
                  >
                    +
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
