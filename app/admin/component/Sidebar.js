"use client";
import React, { useContext, useState } from "react";
import { MdHome, MdAccountBalance } from "react-icons/md";
import { FaTable, FaChartLine } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import Link from "next/link";
import { FaTruck } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { UserContext } from "../../context/UserContextProvider";

const iconData = [
  { index: 0, icon: MdHome, name: "Home", key: "house" },
  { index: 1, icon: FaTable, name: "Booking", key: "rxDashboard" },
  { index: 2, icon: FaTruck, name: "Vehicle", key: "vehicle" },

  { index: 3, icon: MdAccountBalance, name: "Account", key: "chartLine" },
  { index: 4, icon: FaChartLine, name: "Reports", key: "table" },
  { index: 5, icon: IoMdSettings, name: "Settings", key: "info" },
];

const paths = [
  "/admin",
  "/admin/booking",
  "/admin/account",
  "/admin/report",
  "/admin/transport",
  "/admin/settings",
];

const Sidebar = () => {
  const { user } = useContext(UserContext);
  const userName = user?.name || "User Name";
  const userFirstName = userName.split(" ")[0];
  const role = user ?.isOwner ? "Owner" : "Admin";

  const [selectedButton, setSelectedButton] = useState();

  const handleButtonClick = (item) => {
    setSelectedButton(item.index);
    console.log(paths[item.index]);
  };

  const IconComponent = ({ item, selected }) => {
    const Icon = item.icon;
    return (
      <>
        <Icon
          className={`h-5 w-5 text-gray-400 md:h-6 md:w-6 ${
            selected ? "fill-blue-700" : ""
          }`}
        />
        <p
          className={`xl:text-md text-sm lg:hidden xl:block ${
            selected ? "text-slate-700" : "text-gray-500"
          }`}
        >
          {item.name}
        </p>
      </>
    );
  };

  return (
    <>
      <div className="flex items-center justify-start p-7 lg:p-8">
        <h1 className="text-md block font-bold tracking-wider md:text-lg lg:hidden lg:text-xl xl:block">
          BIHAR
          <pre className="font-normal">TRANSPORT</pre>
        </h1>
        <h1 className="text-md hidden font-bold tracking-wider md:text-lg lg:block lg:text-xl xl:hidden">
          BT
        </h1>
      </div>

      <hr />
      <div className="flex min-h-[87vh] flex-col justify-between">
        <div className="flex flex-col lg:w-[12vw]">
         
          {iconData.map((item) => (
            <Link key={item.index} href={paths[item.index]}>
              <button
                onClick={() => handleButtonClick(item)}
                className={`flex w-full items-center justify-start gap-x-3 px-6 py-4 hover:bg-blue-50 active:bg-blue-50  md:gap-x-6 ${
                  selectedButton === item.index
                    ? "rounded-md border-r-4 border-blue-700 lg:border-r-8"
                    : ""
                }`}
              >
                <IconComponent
                  item={item}
                  selected={selectedButton === item.index}
                />
              </button>
            </Link>
          ))}
        </div>

        <div className="flex flex-col ">
          <button className="flex w-full items-center justify-between  p-4 py-2 ">
            <div className="flex flex-col items-start">
              <h2 className="text-md text-left"> {userFirstName}</h2>
              <p className="text-sm text-gray-400">{role }</p>
            </div>
            <MdAccountCircle className="h-6 w-6 text-gray-400 md:h-8 md:w-8" />
          </button>
          <button className="flex w-full items-center justify-between  p-4 py-2">
            <h2 className="flex flex-col items-start">Log Out</h2>
            <GoSignOut className="h-6 w-6 text-gray-400 md:h-8 md:w-8" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
