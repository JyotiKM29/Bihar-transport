"use client";
import React, { useState } from "react";
import Sidebar from "./component/Sidebar";
import { useRouter } from "next/navigation";
import { FaBars } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

const DashboardLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const renderSidebar = () => {
    if (isOpen) {
      return (
        <div
          className=" h-screen w-screen bg-black bg-opacity-80 
        backdrop-blur-sm backdrop-filter"
        >
          <div className="relative h-full w-[200px] bg-white">
            <button className="absolute right-2 top-2" onClick={toggleSidebar}>
              <RxCross2 className="h-6 w-6" />
            </button>
            <Sidebar className="absolute" />
          </div>
        </div>
      );
    } else {
      return (
        <button
          style={{ backgroundColor: "transparent" }}
          className="h-min bg-transparent p-8"
          onClick={toggleSidebar}
        >
          <FaBars className="h-6 w-6" />
        </button>
      );
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="hidden lg:block lg:w-[5rem] xl:min-w-min">
        <Sidebar />
      </div>

      <div className="min-h-full w-full  overflow-y-scroll bg-blue-50 p-4 md:p-8">
        {children}
      </div>
      <div className="fixed lg:hidden ">{renderSidebar()}</div>
    </div>
  );
};

export default DashboardLayout;
