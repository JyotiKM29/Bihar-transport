
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
        <button style={{ backgroundColor: 'transparent' }}className="bg-transparent h-min p-4" onClick={toggleSidebar}>
          <FaBars className="h-6 w-6" />
        </button>
      );
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="hidden lg:block xl:min-w-min lg:w-[5rem]">
        <Sidebar  />
      </div>
      <div className="lg:hidden fixed bg-white">{renderSidebar()}</div>
      <div className="p-8 pt-14 md:p-8 w-full min-h-full overflow-y-scroll bg-blue-50">{children}</div>
    </div>
  
  );
};

export default DashboardLayout;
