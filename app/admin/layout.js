
'use client'
import React, { useState } from "react";
import Sidebar from "../component/Sidebar";
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
        <div className="relative h-screen">
          <button className="absolute right-2 top-2" onClick={toggleSidebar}>
            <RxCross2 className="h-6 w-6" />
          </button>
          <Sidebar className="absolute"  />
        </div>
      );
    } else {
      return (
        <button className="bg-blue-50 h-min p-4" onClick={toggleSidebar}>
          <FaBars className="h-6 w-6" />
        </button>
      );
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="hidden md:block lg:min-w-min md:w-[5rem]">
        <Sidebar  />
      </div>
      <div className="md:hidden fixed bg-white">{renderSidebar()}</div>
      <div className="p-12 md:p-8 w-full bg-blue-50">{children}</div>
    </div>
  
  );
};

export default DashboardLayout;
