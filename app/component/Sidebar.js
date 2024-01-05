'use client'
import React, { useState } from "react";
import { MdHome, MdAccountBalance } from "react-icons/md";
import { FaTable, FaChartLine } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

import Link from "next/link";
import path from "path";

const iconData = [
  { index: 0, icon: MdHome, name: "Home", key: "house" },
  { index: 1, icon: FaTable, name: "Booking", key: "rxDashboard" },
  { index: 2, icon: MdAccountBalance, name: "Accounting", key: "chartLine" },
  { index: 3, icon: FaChartLine, name: "Reports", key: "table" },
  { index: 4, icon: IoMdSettings, name: "Settings", key: "info" },
];

const paths = [
 "/admin",
   "/admin/booking",
   "/admin/accounting",
  "/admin/report",
  "/admin/settings",
];

const Sidebar = () => {
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
          className={`h-5 w-5 md:h-6 md:w-6 text-gray-400 ${
            selected ? "fill-blue-700" : ""
          }`}
        />
        <p
          className={`md:hidden lg:block text-sm lg:text-md ${
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
      <div className="flex justify-start items-center p-7 lg:p-8">
        <h1 className="block md:hidden lg:block font-bold text-md md:text-lg lg:text-xl tracking-wider">
          BIHAR
          <pre className="font-normal">TRANSPORT</pre>
        </h1>
        <h1 className="hidden md:block lg:hidden font-bold text-md md:text-lg lg:text-xl tracking-wider">
          BT
        </h1>
      </div>

      <hr />
      <div>
        <div className="flex flex-col md:w-[14rem]">
          {iconData.map((item) => (
            <Link
             key={item.index}
             href={paths[item.index]}
            >
            
            <button
            
              onClick={() => handleButtonClick(item)}
              className={`flex items-center justify-start px-6 py-4 gap-x-3 md:gap-x-6 hover:bg-blue-50 active:bg-blue-50 ${
                selectedButton === item.index
                  ? "rounded-md border-r-4 lg:border-r-8 border-blue-700"
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
      </div>
    </>
  );
};

export default Sidebar;
