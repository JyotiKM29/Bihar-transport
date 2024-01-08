import React from "react";
import RadialBarChart from "./Charts/RadialBarChart";
import { BsBank2 } from "react-icons/bs";
import { Progress } from "../../components/ui/progress";
import { FiBarChart } from "react-icons/fi";
import { FaClock } from "react-icons/fa";

const TodayData = () => {
  return (
    <div className="w-full h-[90vh]">
      <div className="w-full mb-4">
        <h1 className="text-4xl">Today Dashboard</h1>
      </div>
      <div
        className="min-h xl:h-[95%] w-full grid
  grid-cols-4  grid-rows-4 md:grid-rows-5
   xl:grid-cols-5 xl:grid-rows-2 gap-6"
      >
        <div
          className="col-span-4 row-span-2 
      lg:col-span-4 lg:row-span-2 
      xl:row-span-1 xl:col-span-4 
       grid 
      grid-cols-1 grid-rows-6
      md:grid-cols-2 md:grid-rows-3
     
    xl:grid-cols-3 xl:grid-rows-2 gap-6 "
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white  rounded-3xl shadow-md  
          h-full w-full flex"
            >
              <div className=" h-full w-1/2 pl-10 py-10  flex flex-col justify-between">
                <h4 className="text-lg text-slate-400">Pending Order</h4>
                <h2 className="text-6xl text-semiBold ">10</h2>
              </div>
              <div className=" h-full w-1/2 p-2">
                <RadialBarChart />
              </div>
            </div>
          ))}
        </div>

        <div
          className="
    row-start-3 col-span-4
    
    xl:row-span-2 xl:col-span-1 grid 
    
    md:grid-cols-3 md:grid-rows-1
    xl:grid-rows-3 xl:grid-cols-1 gap-6"
        >
          <div className="bg-gradient-to-t from-[#0906b7] to-blue-500 border rounded-3xl shadow-md p-6 text-white flex flex-col justify-between">
            <p className="text-2xl font-light">Total Order</p>
            <h4 className="text-7xl  text-center font-semiBold">100</h4>
            <FiBarChart className="h-12 w-12 relative self-end" />
          </div>

          <div className="bg-white border rounded-3xl shadow-md p-6 flex flex-col space-y-2">
            <p className="text-slate-400 text-md  ">Easy way Bill Expiry</p>
            <p className="text-blue-700 text-md text-right">in 2 days</p>
            <h4 className="text-7xl text-bold">0</h4>
            <div className="border rounded-full bg-blue-200 h-[5rem] w-[5rem] self-end flex justify-center items-center">

            <FaClock  className="fill-blue-700 h-10 w-10"/>
            </div>
          </div>

          <div className="bg-gradient-to-t from-[#0906b7] to-blue-500  border rounded-3xl shadow-md p-6">
            <p>Advance Booking</p>
            <h4>
              <span>10</span>/10
            </h4>
          </div>
        </div>

        <div
          className="
      row-span-2
    xl:row-start-2 xl:row-end-3 col-span-4 md:flex space-y-6 md:gap-6"
        >
          <div className=" w-full md:w-2/5 grid grid-rows-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-white  rounded-3xl shadow-md  h-full w-full "
              >
                <div className=" h-[70%] w-full py-5 px-6 flex justify-between">
                  <h2 className="text-4xl"> 10</h2>
                  <div>
                    <h4 className="text-lg text-slate-400">Invoice</h4>
                    <h2 className="text-lg text-right text-blue-700">37%</h2>
                  </div>
                </div>
                <div className=" h-[10%] w-full px-6">
                  <Progress value={80} />
                </div>
              </div>
            ))}
          </div>
          <div className="w-full  md:w-3/5 grid grid-rows-2 gap-6">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="bg-white border rounded-3xl shadow-md p-6   flex"
              >
                <div className="w-2/3 h-full flex flex-col justify-between">
                  <p className="text-xl text-slate-400">Balance Amount</p>
                  <h2 className="text-6xl">100000</h2>
                </div>
                <div className="w-1/3 h-full">
                  <div className="w-[75%] h-full border rounded-full px-15 py-8 bg-blue-100">
                    <BsBank2 className="h-full w-full fill-blue-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayData;
