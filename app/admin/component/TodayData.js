import React from "react";
import RadialBarChart from "./Charts/RadialBarChart";
import { BsBank2 } from "react-icons/bs";
import { Progress } from "../../components/ui/progress";
import { FiBarChart } from "react-icons/fi";
import { FaClock } from "react-icons/fa";


const TodayData = () => {
  return (
    <div className="h-[90vh] w-full">
      <div className="h-8 mb-4 w-full ">
      <h1 className="hidden text-4xl  lg:block">Today Dashboard</h1>
      </div>
      <div
        className="min-h grid w-full grid-cols-4
  grid-rows-4  gap-6 md:grid-rows-5
   xl:h-[95%] xl:grid-cols-5 xl:grid-rows-2"
      >
        <div
          className="col-span-4 row-span-2 
                      grid grid-cols-1 
                     grid-rows-6 gap-6 
                      md:grid-cols-2 
                       md:grid-rows-3 lg:col-span-4
                        lg:row-span-2 xl:col-span-4
                       xl:row-span-1 xl:grid-cols-3 xl:grid-rows-2 "
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex  h-full w-full  
          rounded-3xl bg-white p-4 shadow-md "
            >
              <div className=" flex h-full w-2/5 flex-col justify-between p-2 xl:p-1 2xl:p-2">
                <p className="text-lg text-slate-400 xl:text-base 2xl:text-lg xl:text-wrap 2xl:text-wrap">
                  Pending Order
                </p>
                <h2 className="text-semiBold text-6xl lg:text-5xl ">10</h2>
              </div>
              <div className=" h-full w-3/5 flex-grow-1 ">
                <RadialBarChart />
              </div>
            </div>
          ))}
        </div>

        <div
          className="
    col-span-4 row-start-3
    grid gap-6 md:grid-cols-3 
    md:grid-rows-1 xl:col-span-1
    xl:row-span-2 xl:grid-cols-1 xl:grid-rows-3"
        >
          <div className="flex flex-col justify-between rounded-3xl border bg-gradient-to-t from-[#0906b7] to-blue-500 p-4 lg:p-7 text-white shadow-md">
            <p className="text-2xl font-light">Total Order</p>
            <h4 className="font-semiBold  text-center text-8xl xl:text-7xl">100</h4>
            <FiBarChart className="relative h-12 w-12 self-end" />
          </div>

          <div className="flex flex-col justify-between rounded-3xl border bg-white p-4 lg:p-6 shadow-md">
            <div>
              <p className="text-md text-left  text-slate-400">
                Easy way Bill Expiry{" "}
              </p>
              <p className="text-left text-blue-700 ">in 2 days</p>
            </div>

            <h4 className="text-bold text-center text-8xl  xl:text-6xl">0</h4>

            <FaClock className="h-12  self-end fill-blue-700" size={20} />
          </div>

          <div className="flex flex-col justify-between  rounded-3xl border bg-gradient-to-t from-[#0906b7] to-blue-500 p-4 lg:p-7 text-white shadow-md ">
            <p className="self-start text-2xl font-light">Advance Booking</p>
            <h4 className="self-end text-7xl xl:text-5xl" style={{ fontWeight: "300" }}>
              <span style={{ fontWeight: "500" }}>10</span>/10
            </h4>
          </div>
        </div>

        <div
          className="
      col-span-4
    row-span-2 space-y-6 md:flex md:gap-6 xl:row-start-2 xl:row-end-3"
        >
          <div className=" grid w-full grid-rows-3 gap-6  md:w-2/5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-full  w-full rounded-3xl  bg-white shadow-md p-4 lg:px-6 lg:py-4 flex flex-col justify-between"
              >
                <div className=" flex w-full justify-between ">
                  <h2 className="text-4xl md:text-6xl"> 10</h2>
                  <div>
                    <h4 className="text-lg text-slate-400">Invoice</h4>
                    <h2 className="text-right text-lg text-blue-700">37%</h2>
                  </div>
                </div>
               
                  <Progress value={80} />
                
              </div>
            ))}
          </div>
          <div className="grid  w-full grid-rows-2 gap-6 md:w-3/5">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="flex rounded-3xl border bg-white p-4 lg:p-7   shadow-md"
              >
                <div className="flex h-full w-2/3 flex-col justify-between">
                  <p className="text-xl text-slate-400">Balance Amount</p>
                  <h2 className="text-4xl 2xl:text-6xl">100000</h2>
                </div>
                <div className="h-full w-1/3 flex justify-center items-center">
                  <div className="h-[20vw] w-[20vw] md:h-[15vw] md:w-[15vw]  xl:h-[8vw] xl:w-[8vw] 2xl:h-[6vw] 2xl:w-[6vw] rounded-full border bg-blue-100 flex justify-center items-center">
                    <BsBank2 className="h-[10vw] w-[10vw] 
                    md:h-[6vw] md:w-[6vw] xl:w-[3vw] xl:h-[3vw] 2xl:h-[1.5vw] 2xl:w-[1.5vw] fill-blue-700" />
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
