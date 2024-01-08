
'use client'
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
        <div className=" h-screen w-screen bg-black bg-opacity-80 
        backdrop-filter backdrop-blur-sm">
          <div className="relative w-[200px] h-full bg-white">

          <button className="absolute right-2 top-2" onClick={toggleSidebar}>
            <RxCross2 className="h-6 w-6" />
          </button>
          <Sidebar className="absolute"  />
          </div>
       
          
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
      

      <div className="p-8 pt-14 md:p-8 w-full min-h-full overflow-y-scroll bg-blue-50">{children}</div>
      <div className="lg:hidden fixed ">{renderSidebar()}</div>
 
    </div>
  
  );
};

export default DashboardLayout;
