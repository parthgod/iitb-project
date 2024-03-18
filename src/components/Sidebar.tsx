"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ISIdeMenu } from "@/utils/defaultTypes";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { FaTable } from "react-icons/fa";
import { FcElectricity } from "react-icons/fc";
import { GrDocumentUser } from "react-icons/gr";
import { MdManageHistory } from "react-icons/md";
import ProfileIcon from "./ProfileIcon";

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const clickRef = useRef<HTMLButtonElement>(null);

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
      name: "IBR",
      route: "/ibr",
      icon: <FaTable />,
    },
    {
      name: "LCC-HVDC Link",
      route: "/lccHVDCLink",
      icon: <FaTable />,
    },
    {
      name: "Series Facts",
      route: "/seriesFact",
      icon: <FaTable />,
    },
    {
      name: "Shunt Facts",
      route: "/shuntFact",
      icon: <FaTable />,
    },
    {
      name: "VSC-HVDC Link",
      route: "/vscHVDCLink",
      icon: <FaTable />,
    },
    // {
    //   name: "Requests",
    //   route: "/requests",
    //   icon: <GrDocumentUser />,
    // },
    // {
    //   name: "Edit History",
    //   route: "/historyLog",
    //   icon: <MdManageHistory />,
    // },
  ];

  useEffect(() => {
    if (clickRef.current) {
      clickRef.current.click();
    }
  }, []);

  return (
    <div
      className={`h-screen overflow-hidden bg-[#f4f4f4] text-gray-800 transition-all duration-200 ease-in-out w-1/6 scrollbar-hide shadow-[inset_-12px_-8px_40px_#46464620] border-r-2 border-gray-300 flex flex-col items-center justify-between`}
    >
      <div className="flex flex-col w-full items-center">
        <div className="flex bg-white items-center h-[10vh] justify-start px-3 py-3 self-start text-2xl gap-1 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] w-full">
          <FcElectricity />
          <p className="font-semibold line-clamp-1">Power Systems</p>
        </div>
        <div className="text-lg w-full scrollbar-hide h-[80vh] p-2 text-center gap-1 flex flex-col items-start pt-3 overflow-auto">
          <Link
            href="/requests"
            className={`flex transition-colors duration-300 ease-in-out w-full justify-start gap-3 p-2 pl-5 items-center rounded-lg ${
              pathname === "/requests"
                ? "bg-white text-blue-600 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]"
                : "hover:bg-[#d7d7d7]"
            }`}
          >
            <GrDocumentUser />
            <p>Requests</p>
          </Link>

          <Link
            href="/historyLog"
            className={`flex transition-colors duration-300 ease-in-out w-full justify-start gap-3 p-2 pl-5 items-center rounded-lg ${
              pathname === "/historyLog"
                ? "bg-white text-blue-600 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]"
                : "hover:bg-[#d7d7d7]"
            }`}
          >
            <MdManageHistory />
            <p className="whitespace-nowrap">History</p>
          </Link>
          <Accordion
            type="single"
            className="flex w-full justify-between gap-3 p-2 pl-5 items-center rounded-lg"
            collapsible
          >
            <AccordionItem
              value="item-1"
              className="w-full"
            >
              <AccordionTrigger
                className="w-full"
                ref={clickRef}
              >
                <div className="flex items-center gap-3">
                  <FaTable />
                  Tables
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col items-start max-h-[57vh] overflow-auto custom-scrollbar text-left pl-2 text-xs xl:text-base w-full">
                {sideMenu.map((item) => (
                  <div
                    key={item.route}
                    className="w-full border-l-[1px] border-black pl-4"
                  >
                    <Link href={item.route}>
                      <p
                        className={`rounded-lg transition-colors duration-300 ease-in-out p-2 ${
                          pathname === item.route
                            ? "bg-white text-blue-600 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]"
                            : "hover:bg-[#d7d7d7]"
                        }`}
                      >
                        {item.name}
                      </p>
                    </Link>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <ProfileIcon session={session!} />
    </div>
  );
};

export default Sidebar;
