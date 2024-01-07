import React from "react";
import RadialBarChart from "../component/Charts/RadialBarChart";
import { BsBank2 } from "react-icons/bs";


function Admin() {

  // const shouldRenderChart = typeof window !== 'undefined'; // Check if window is defined


  return (
    <div className="w-full min-h-full">
      <div className="w-full mb-4">
        <h1 className="text-4xl">Dashboard</h1>
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
              <div className=" h-full w-1/2 p-6 flex flex-col justify-between">
                <h4 className="text-lg text-slate-400">Pending Order</h4>
                <h2 className="text-5xl text-semiBold ">10</h2>
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
          <div className="bg-gradient-to-t from-[#0906b7] to-blue-500 border rounded-3xl shadow-md p-6"></div>

          <div className="bg-white border rounded-3xl shadow-md p-6"></div>

          <div className="bg-gradient-to-t from-[#0906b7] to-blue-500  border rounded-3xl shadow-md p-6"></div>
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
                <div className=" h-[70%] w-full p-6 flex justify-between">
                  <h2 className="text-2xl"> 10</h2>
                  <div>
                    <h4>Invoice</h4>
                    <h2>37%</h2>
                  </div>
                </div>
                <div className=" h-[10%] w-full px-6">
                  {/* line chart */}
                  <div className="relative w-[100%]  h-4 bg-blue-100 border rounded-full">
                    <div className="absolute w-[80%] px-6 h-4 bg-blue-700 border rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full  md:w-3/5 grid grid-rows-2 gap-6">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="bg-white border rounded-3xl shadow-md p-6 flex"
              >
                <div className="w-2/3 h-full">
                  <p>Balance Amount</p>
                  <h2 className="text-3xl">100000</h2>
                </div>
                <div className="w-1/3 h-full">
                  <div className="w-[75%] h-full border rounded-full px-14 py-8 bg-blue-100">
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
}

export default Admin;

// className='bg-purple-200 border rounded-3xl shadow-md p-6'
